import { Search, Filter } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useEffect, useState } from 'react';
import { ShipmentDetailsModal } from './ShipmentDetailsModal';
import { api } from '../lib/api';

export function ActiveShipments() {
  const { t, language } = useLanguage();
  const [selectedShipment, setSelectedShipment] = useState<any>(null);
  const [shipments, setShipments] = useState<any[]>([]);

  const getStatus = (status: string) => {
    if (language === 'en') {
      switch (status) {
        case 'IN_TRANSIT': return 'In Transit';
        case 'LOADED': return 'Loaded';
        case 'ARRIVED': return 'Arrived';
        default: return status;
      }
    }
    if (language === 'kk') {
      switch (status) {
        case 'IN_TRANSIT': return 'Жолда';
        case 'LOADED': return 'Тиелген';
        case 'ARRIVED': return 'Келді';
        default: return status;
      }
    }
    return status;
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'IN_TRANSIT':
        return 'bg-blue-100 text-blue-700';
      case 'LOADED':
        return 'bg-purple-100 text-purple-700';
      case 'ARRIVED':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  useEffect(() => {
    api.listShipments()
      .then((data) => setShipments(data))
      .catch(() => setShipments([]));
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">{t('activeShipmentsTitle')}</h1>
        <p className="text-gray-600">{t('activeShipmentsDesc')}</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              <Filter className="w-5 h-5" />
              {t('filters')}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('number')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('client')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('routeColumn')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('weightColumn')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('date')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('status')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {shipments.map((shipment) => (
                <tr key={shipment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-blue-600">{shipment.shipment_id || shipment.id}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{shipment.client_id ?? '-'}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{shipment.origin_station} → {shipment.destination_station}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{shipment.weight_kg ?? '-'} кг</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{shipment.created_at?.slice(0, 10) ?? '-'}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusColor(shipment.status)}`}>
                      {getStatus(shipment.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      onClick={() => setSelectedShipment({
                        id: shipment.shipment_id || shipment.id,
                        client: shipment.client_id ? `Client #${shipment.client_id}` : '-',
                        from: shipment.origin_station,
                        to: shipment.destination_station,
                        status: getStatus(shipment.status),
                        date: shipment.created_at?.slice(0, 10) ?? '-',
                        weight: `${shipment.weight_kg ?? '-'} кг`,
                      })}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      {t('details')}
                    </button>
                    <button
                      onClick={() => api.cancelShipment(shipment.id)}
                      className="ml-3 text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      {t('cancel')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedShipment && (
        <ShipmentDetailsModal
          shipment={{
            ...selectedShipment,
            status: getStatus(selectedShipment.status)
          }}
          onClose={() => setSelectedShipment(null)}
        />
      )}
    </div>
  );
}
