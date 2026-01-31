import { QrCode, Scan, ArrowDown, ArrowUp } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function Transit() {
  const { t } = useLanguage();

  const incomingShipments = [
    { id: 'SH-2024-101', from: 'Астана Нұрлы Жол', eta: '14:30', train: '№ 15', status: 'В пути' },
    { id: 'SH-2024-105', from: 'Шымкент', eta: '16:20', train: '№ 22', status: 'В пути' },
    { id: 'SH-2024-108', from: 'Қарағанды', eta: '18:45', train: '№ 8', status: 'Задержка' },
  ];

  const outgoingShipments = [
    { id: 'SH-2024-001', to: 'Астана Нұрлы Жол', departure: '14:30', train: '№ 15', status: 'Готов' },
    { id: 'SH-2024-003', to: 'Астана Нұрлы Жол', departure: '14:30', train: '№ 15', status: 'Готов' },
    { id: 'SH-2024-005', to: 'Шымкент', departure: '16:45', train: '№ 22', status: 'Погрузка' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">{t('transitTitle')}</h1>
        <p className="text-gray-600">{t('transitDesc')}</p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* QR Scanning */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <QrCode className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('qrScanning')}</h2>
            <p className="text-gray-600 mb-6">{t('scanQrDesc')}</p>
            
            <div className="mb-6">
              <div className="w-48 h-48 mx-auto border-4 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                <Scan className="w-16 h-16 text-gray-400" />
              </div>
            </div>

            <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
              {t('startScanning')}
            </button>
          </div>
        </div>

        {/* Incoming Shipments */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <ArrowDown className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Входящие грузы</h3>
          </div>
          
          <div className="space-y-3">
            {incomingShipments.map((shipment) => (
              <div key={shipment.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-blue-600">{shipment.id}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    shipment.status === 'Задержка' 
                      ? 'bg-red-100 text-red-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {shipment.status}
                  </span>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>Откуда: {shipment.from}</div>
                  <div>Поезд: {shipment.train}</div>
                  <div className="font-medium text-gray-900">Прибытие: {shipment.eta}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Outgoing Shipments */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <ArrowUp className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Исходящие грузы</h3>
          </div>
          
          <div className="space-y-3">
            {outgoingShipments.map((shipment) => (
              <div key={shipment.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-blue-600">{shipment.id}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    shipment.status === 'Готов' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {shipment.status}
                  </span>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>Куда: {shipment.to}</div>
                  <div>Поезд: {shipment.train}</div>
                  <div className="font-medium text-gray-900">Отправление: {shipment.departure}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Scans */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('recentScans')}</h3>
        
        <div className="grid grid-cols-3 gap-4">
          {[
            { id: 'SH-2024-001', time: '14:25', location: 'Алматы-1', action: t('loading') },
            { id: 'SH-2024-003', time: '14:20', location: 'Астана Нұрлы Жол', action: t('arrivalScan') },
            { id: 'SH-2024-005', time: '14:15', location: 'Шымкент', action: t('issuance') }
          ].map((scan, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-medium text-blue-600">{scan.id}</span>
                <span className="text-xs text-gray-500">{scan.time}</span>
              </div>
              <div className="text-sm text-gray-600">
                <div>{scan.location}</div>
                <div className="text-xs mt-1">{t('action')}: {scan.action}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}