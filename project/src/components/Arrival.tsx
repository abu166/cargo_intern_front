import { Package, Bell } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useEffect, useState } from 'react';
import { api } from '../lib/api';

export function Arrival() {
  const { t } = useLanguage();
  const [arrivals, setArrivals] = useState<any[]>([]);

  const loadArrivals = () => {
    api.listShipments()
      .then((data) => {
        const arrived = data.filter((s) => ['ARRIVED', 'NOTIFIED'].includes(s.status));
        setArrivals(arrived);
      })
      .catch(() => setArrivals([]));
  };

  useEffect(() => {
    loadArrivals();
  }, []);

  const createDemoArrival = async () => {
    const created = await api.createShipment({
      origin_station: 'A',
      destination_station: 'B',
      weight_kg: 10,
    });
    await api.updateShipmentStatus(created.id, 'TARIFF_CALCULATED');
    await api.updateShipmentStatus(created.id, 'PAID');
    await api.updateShipmentStatus(created.id, 'QR_GENERATED');
    await api.updateShipmentStatus(created.id, 'DOCUMENTS_CREATED');
    await api.updateShipmentStatus(created.id, 'LOADED');
    await api.updateShipmentStatus(created.id, 'IN_TRANSIT');
    await api.updateShipmentStatus(created.id, 'ARRIVED');
    loadArrivals();
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">{t('arrivalTitle')}</h1>
        <p className="text-gray-600">{t('arrivalDesc')}</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">{t('arrivedShipments')}</h3>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={() => arrivals.forEach((a) => api.deliveryReady(a.id))}
            >
              <Bell className="w-5 h-5" />
              {t('notifyAll')}
            </button>
          </div>
        </div>

        {arrivals.length === 0 ? (
          <div className="p-6 text-sm text-gray-600">
            Нет прибывших отправок. 
            <button
              className="ml-2 text-blue-600 hover:text-blue-700"
              onClick={createDemoArrival}
            >
              Создать демо
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
          {arrivals.map((arrival) => (
            <div key={arrival.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="w-6 h-6 text-green-600" />
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-sm font-medium text-blue-600">{arrival.shipment_id || arrival.id}</span>
                      {arrival.status === 'NOTIFIED' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700">
                          <Bell className="w-3 h-3" />
                          {t('notified')}
                        </span>
                      )}
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">{arrival.client_id ? `Client #${arrival.client_id}` : '-'}</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>{t('arrivedFrom')} {arrival.origin_station}</div>
                      <div>{t('arrivedAt')} {arrival.created_at?.slice(0, 16) ?? '-'}</div>
                      <div>{t('weightColumn')}: {arrival.weight_kg ?? '-'} кг</div>
                      <div>{t('phone')} -</div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {arrival.status !== 'NOTIFIED' && (
                    <button
                      className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
                      onClick={() => api.deliveryReady(arrival.id)}
                    >
                      {t('notify')}
                    </button>
                  )}
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    onClick={() => api.deliveryConfirm(arrival.id)}
                  >
                    {t('issue')}
                  </button>
                </div>
              </div>
            </div>
          ))}
          </div>
        )}
      </div>
    </div>
  );
}
