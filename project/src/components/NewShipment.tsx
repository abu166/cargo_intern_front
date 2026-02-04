import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ClientInfo } from './shipment-steps/ClientInfo';
import { CargoDetails } from './shipment-steps/CargoDetails';
import { Payment } from './shipment-steps/Payment';
import { api } from '../lib/api';

type Step = 'client' | 'cargo' | 'payment' | 'documents';

export function NewShipment() {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState<Step>('client');
  const [shipmentData, setShipmentData] = useState({
    clientType: 'individual',
    clientName: '',
    clientSource: '',
    clientPhone: '',
    aggregatorClientId: '',
    contractNumber: '',
    hasDeposit: false,
    fromStation: '',
    toStation: '',
    departureDate: '',
    weight: '',
    dimensions: '',
    isFragile: false,
    isOversized: false,
    packaging: '',
    value: '',
    description: '',
    hasTicket: false,
    ticketNumber: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shipmentId, setShipmentId] = useState<number | null>(null);
  const [documentId, setDocumentId] = useState<number | null>(null);

  const updateShipmentData = (data: Partial<typeof shipmentData>) => {
    setShipmentData({ ...shipmentData, ...data });
  };

  const parseDimensions = (value: string) => {
    const parts = value
      .replace(/[×x]/gi, 'x')
      .split('x')
      .map((part) => parseFloat(part.trim()))
      .filter((num) => !Number.isNaN(num));
    if (parts.length >= 3) {
      return { length_cm: parts[0], width_cm: parts[1], height_cm: parts[2] };
    }
    return { length_cm: null, width_cm: null, height_cm: null };
  };

  const handlePaymentNext = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      let clientId: number | null = null;
      if (shipmentData.clientName) {
        const client = await api.createClient({
          full_name: shipmentData.clientName,
          document_id: `DOC-${Date.now()}`,
          phone: shipmentData.clientPhone || undefined,
        });
        clientId = client.id;
      }

      let currentShipmentId = shipmentId;
      if (!currentShipmentId) {
        const dims = parseDimensions(shipmentData.dimensions);
        const created = await api.createShipment({
          client_id: clientId,
          origin_station: shipmentData.fromStation,
          destination_station: shipmentData.toStation,
          weight_kg: shipmentData.weight ? parseFloat(shipmentData.weight) : null,
          ...dims,
        });
        currentShipmentId = created.id;
        setShipmentId(created.id);
      }

      await api.updateShipmentStatus(currentShipmentId, 'TARIFF_CALCULATED');

      const amount = (() => {
        let basePrice = 5000;
        const weight = parseFloat(shipmentData.weight) || 0;
        if (weight > 20) basePrice += (weight - 20) * 150;
        if (shipmentData.isFragile) basePrice += 1000;
        if (shipmentData.isOversized) basePrice += 2500;
        if (shipmentData.hasTicket) basePrice = basePrice * 0.5;
        return Math.round(basePrice);
      })();

      const payment = await api.createPayment({
        shipment_id: currentShipmentId,
        amount,
        method: 'CASH',
      });
      await api.updatePayment(payment.id, { status: 'PAID' });

      await api.generateQr(currentShipmentId);
      const docs = await api.generateDocuments(currentShipmentId, ['LU-12', 'LU-63', 'WAYBILL']);
      if (docs.length) {
        setDocumentId(docs[0].id);
      }
      setCurrentStep('documents');
    } catch (error) {
      alert('Ошибка при создании отправки. Проверьте данные и попробуйте снова.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'client':
        return (
          <ClientInfo
            data={shipmentData}
            onUpdate={updateShipmentData}
            onNext={() => setCurrentStep('cargo')}
          />
        );
      case 'cargo':
        return (
          <CargoDetails
            data={shipmentData}
            onUpdate={updateShipmentData}
            onNext={() => setCurrentStep('payment')}
            onBack={() => setCurrentStep('client')}
          />
        );
      case 'payment':
        return (
          <Payment
            data={shipmentData}
            onNext={handlePaymentNext}
            onBack={() => setCurrentStep('cargo')}
            isSubmitting={isSubmitting}
          />
        );
      case 'documents':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">{t('shipmentCreated')}</h2>
              <p className="text-gray-600 mb-6">{t('documentsReady')}</p>
              <div className="space-y-3">
                <button
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  onClick={() => {
                    if (documentId) {
                      api.getDocument(documentId).catch(() => {});
                    }
                  }}
                >
                  {t('printDocuments')}
                </button>
                <button 
                  onClick={() => {
                    setCurrentStep('client');
                    setShipmentData({
                      clientType: 'individual',
                      clientName: '',
                      clientSource: '',
                      clientPhone: '',
                      aggregatorClientId: '',
                      contractNumber: '',
                      hasDeposit: false,
                      fromStation: '',
                      toStation: '',
                      departureDate: '',
                      weight: '',
                      dimensions: '',
                      isFragile: false,
                      isOversized: false,
                      packaging: '',
                      value: '',
                      description: '',
                      hasTicket: false,
                      ticketNumber: ''
                    });
                    setShipmentId(null);
                    setDocumentId(null);
                  }}
                  className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  {t('newShipmentButton')}
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">{t('newShipmentTitle')}</h1>
        <p className="text-gray-600">{t('newShipmentDesc')}</p>
      </div>

      {currentStep !== 'documents' && (
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-3xl">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === 'client' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                1
              </div>
              <span className={`ml-2 text-sm font-medium ${
                currentStep === 'client' ? 'text-gray-900' : 'text-gray-500'
              }`}>
                {t('clientInfo')}
              </span>
            </div>

            <div className="flex-1 h-px bg-gray-200 mx-4" />

            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === 'cargo' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </div>
              <span className={`ml-2 text-sm font-medium ${
                currentStep === 'cargo' ? 'text-gray-900' : 'text-gray-500'
              }`}>
                {t('cargoDetails')}
              </span>
            </div>

            <div className="flex-1 h-px bg-gray-200 mx-4" />

            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === 'payment' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                3
              </div>
              <span className={`ml-2 text-sm font-medium ${
                currentStep === 'payment' ? 'text-gray-900' : 'text-gray-500'
              }`}>
                {t('payment')}
              </span>
            </div>
          </div>
        </div>
      )}

      {renderStep()}
    </div>
  );
}
