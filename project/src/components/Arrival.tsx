import { Package, Bell } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function Arrival() {
  const { t } = useLanguage();

  const arrivals = [
    {
      id: 'SH-2024-003',
      client: 'Қайрат Айгүл Әміржанқызы',
      from: 'Ақтөбе',
      arrivedAt: '19.01.2026 18:30',
      notified: true,
      weight: '8 кг',
      phone: '+7 (777) 123-45-67'
    },
    {
      id: 'SH-2024-007',
      client: 'Серік Даулет Мұратұлы',
      from: 'Шымкент',
      arrivedAt: '20.01.2026 09:15',
      notified: true,
      weight: '12 кг',
      phone: '+7 (707) 987-65-43'
    },
    {
      id: 'SH-2024-009',
      client: 'ЖШС "ТрансЛогистик"',
      from: 'Қарағанды',
      arrivedAt: '20.01.2026 11:45',
      notified: false,
      weight: '25 кг',
      phone: '+7 (701) 555-55-55'
    }
  ];

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
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Bell className="w-5 h-5" />
              {t('notifyAll')}
            </button>
          </div>
        </div>

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
                      <span className="text-sm font-medium text-blue-600">{arrival.id}</span>
                      {arrival.notified && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700">
                          <Bell className="w-3 h-3" />
                          {t('notified')}
                        </span>
                      )}
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">{arrival.client}</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>{t('arrivedFrom')} {arrival.from}</div>
                      <div>{t('arrivedAt')} {arrival.arrivedAt}</div>
                      <div>{t('weightColumn')}: {arrival.weight}</div>
                      <div>{t('phone')} {arrival.phone}</div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {!arrival.notified && (
                    <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
                      {t('notify')}
                    </button>
                  )}
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    {t('issue')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}