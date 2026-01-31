import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Building2, Plus, Search, Edit, Trash2, Phone, Mail, MapPin } from 'lucide-react';

interface CorporateClient {
  id: string;
  name: string;
  contractNumber: string;
  depositBalance: number;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  activeShipments: number;
}

export function CorporateClients() {
  const { t } = useLanguage();
  const [clients] = useState<CorporateClient[]>([
    {
      id: '1',
      name: 'ТОО "Логистика Плюс"',
      contractNumber: 'КТ-2024-001',
      depositBalance: 150000,
      contactPerson: 'Серікбаев Нұрлан Әміржанұлы',
      phone: '+7 (777) 123-45-67',
      email: 'logistics@logplus.kz',
      address: 'Алматы, пр. Абая 150',
      activeShipments: 12
    },
    {
      id: '2',
      name: 'ЖШС "ТрансКарго"',
      contractNumber: 'КТ-2024-002',
      depositBalance: 280000,
      contactPerson: 'Қайратов Даулет Серікұлы',
      phone: '+7 (707) 987-65-43',
      email: 'info@transcargo.kz',
      address: 'Астана, ул. Мәңгілік Ел 25',
      activeShipments: 24
    },
    {
      id: '3',
      name: 'АО "КазТрансСервис"',
      contractNumber: 'КТ-2024-003',
      depositBalance: 520000,
      contactPerson: 'Әбілов Әлібек Мұратұлы',
      phone: '+7 (701) 555-55-55',
      email: 'contact@kts.kz',
      address: 'Шымкент, ул. Тауке хана 45',
      activeShipments: 35
    }
  ]);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Корпоративные клиенты</h1>
          <p className="text-gray-600">Управление юридическими лицами</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-5 h-5" />
          Добавить клиента
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск по названию, договору..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {clients.map((client) => (
            <div key={client.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{client.name}</h3>
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                        {client.activeShipments} активных
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Договор:</span>
                        <span>{client.contractNumber}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Депозит:</span>
                        <span className="font-semibold text-green-600">{client.depositBalance.toLocaleString()} ₸</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{client.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span>{client.email}</span>
                      </div>
                      <div className="flex items-center gap-2 col-span-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{client.address}</span>
                      </div>
                      <div className="flex items-center gap-2 col-span-2">
                        <span className="font-medium">Контактное лицо:</span>
                        <span>{client.contactPerson}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-5 h-5" />
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
