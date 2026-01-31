import { Search, Filter } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useState } from 'react';
import { ShipmentDetailsModal } from './ShipmentDetailsModal';

export function ActiveShipments() {
  const { t, language } = useLanguage();
  const [selectedShipment, setSelectedShipment] = useState<any>(null);

  const getStatus = (status: string) => {
    if (language === 'en') {
      switch (status) {
        case 'В пути': return 'In Transit';
        case 'Погружен': return 'Loaded';
        case 'Прибыл': return 'Arrived';
        default: return status;
      }
    }
    if (language === 'kk') {
      switch (status) {
        case 'В пути': return 'Жолда';
        case 'Погружен': return 'Тиелген';
        case 'Прибыл': return 'Келді';
        default: return status;
      }
    }
    return status;
  };

  const shipments = [
    {
      id: 'SH-2024-001',
      client: 'Нұрболат Әлібек Серікұлы',
      from: 'Алматы',
      to: 'Астана',
      status: 'В пути',
      statusColor: 'bg-blue-100 text-blue-700',
      date: '20.01.2026',
      weight: '15 кг'
    },
    {
      id: 'SH-2024-002',
      client: 'ЖШС "Логистика Плюс"',
      from: 'Шымкент',
      to: 'Қарағанды',
      status: 'Погружен',
      statusColor: 'bg-purple-100 text-purple-700',
      date: '20.01.2026',
      weight: '32 кг'
    },
    {
      id: 'SH-2024-003',
      client: 'Қайрат Айгүл Әміржанқызы',
      from: 'Ақтөбе',
      to: 'Алматы',
      status: 'Прибыл',
      statusColor: 'bg-green-100 text-green-700',
      date: '19.01.2026',
      weight: '8 кг'
    }
  ];

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
                    <span className="text-sm font-medium text-blue-600">{shipment.id}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{shipment.client}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{shipment.from} → {shipment.to}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{shipment.weight}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{shipment.date}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${shipment.statusColor}`}>
                      {getStatus(shipment.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      onClick={() => setSelectedShipment(shipment)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      {t('details')}
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
