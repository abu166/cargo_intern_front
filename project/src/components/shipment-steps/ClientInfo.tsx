import { ArrowRight, Users } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useEffect } from 'react';

interface ClientInfoProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
}

// Моковые данные клиентов от агрегаторов
const aggregatorClients: Record<string, Array<{ id: string; name: string; phone: string; contractNumber: string }>> = {
  glovo: [
    { id: 'GLV-001', name: 'Ермек Асанов', phone: '+7 701 234 5678', contractNumber: 'GLV-2024-001' },
    { id: 'GLV-002', name: 'Айгүл Сейтова', phone: '+7 702 345 6789', contractNumber: 'GLV-2024-002' },
    { id: 'GLV-003', name: 'Нұрлан Қасымов', phone: '+7 705 456 7890', contractNumber: 'GLV-2024-003' },
  ],
  choko: [
    { id: 'CHK-001', name: 'Данияр Әлімов', phone: '+7 707 567 8901', contractNumber: 'CHK-2024-001' },
    { id: 'CHK-002', name: 'Сәуле Жұмабаева', phone: '+7 708 678 9012', contractNumber: 'CHK-2024-002' },
    { id: 'CHK-003', name: 'Бауыржан Төлеуов', phone: '+7 775 789 0123', contractNumber: 'CHK-2024-003' },
  ],
};

export function ClientInfo({ data, onUpdate, onNext }: ClientInfoProps) {
  const { t } = useLanguage();

  // Автозаполнение при выборе источника агрегатора
  const handleSourceChange = (source: string) => {
    onUpdate({ clientSource: source });
    
    // Если выбран агрегатор, очищаем данные клиента для нового выбора
    if (source === 'glovo' || source === 'choko') {
      onUpdate({ 
        clientSource: source,
        aggregatorClientId: '',
        clientName: '',
        clientPhone: '',
        contractNumber: ''
      });
    } else {
      onUpdate({ 
        clientSource: source,
        aggregatorClientId: '',
        clientPhone: ''
      });
    }
  };

  // Автозаполнение данных клиента при выборе из списка агрегатора
  const handleAggregatorClientSelect = (clientId: string) => {
    const source = data.clientSource;
    if (source === 'glovo' || source === 'choko') {
      const clients = aggregatorClients[source];
      const selectedClient = clients.find(c => c.id === clientId);
      
      if (selectedClient) {
        onUpdate({
          aggregatorClientId: clientId,
          clientName: selectedClient.name,
          clientPhone: selectedClient.phone,
          contractNumber: selectedClient.contractNumber
        });
      }
    }
  };

  const isAggregatorSource = data.clientSource === 'glovo' || data.clientSource === 'choko';
  const currentAggregatorClients = isAggregatorSource ? aggregatorClients[data.clientSource] : [];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('clientInfo')}</h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('clientType')}
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="individual"
                checked={data.clientType === 'individual'}
                onChange={(e) => onUpdate({ clientType: e.target.value })}
                className="w-4 h-4 text-blue-600"
              />
              <span className="ml-2 text-sm text-gray-700">{t('individual')}</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="legal"
                checked={data.clientType === 'legal'}
                onChange={(e) => onUpdate({ clientType: e.target.value })}
                className="w-4 h-4 text-blue-600"
              />
              <span className="ml-2 text-sm text-gray-700">{t('legal')}</span>
            </label>
          </div>
        </div>

        {data.clientType === 'individual' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('clientSource')}
            </label>
            <select
              value={data.clientSource}
              onChange={(e) => handleSourceChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{t('selectSource')}</option>
              <option value="glovo">Glovo</option>
              <option value="choko">Choko</option>
              <option value="direct">{t('directContact')}</option>
            </select>
          </div>
        )}

        {/* Выбор клиента из агрегатора */}
        {isAggregatorSource && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                Выберите клиента из {data.clientSource === 'glovo' ? 'Glovo' : 'Choko'}
              </span>
            </div>
            <select
              value={data.aggregatorClientId || ''}
              onChange={(e) => handleAggregatorClientSelect(e.target.value)}
              className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">Выберите клиента...</option>
              {currentAggregatorClients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.name} - {client.phone}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('clientName')}
          </label>
          <input
            type="text"
            value={data.clientName}
            onChange={(e) => onUpdate({ clientName: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={t('enterClientName')}
            readOnly={isAggregatorSource && data.aggregatorClientId}
          />
        </div>

        {/* Телефон клиента */}
        {data.clientType === 'individual' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Телефон
            </label>
            <input
              type="tel"
              value={data.clientPhone || ''}
              onChange={(e) => onUpdate({ clientPhone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+7 ___ ___ ____"
              readOnly={isAggregatorSource && data.aggregatorClientId}
            />
          </div>
        )}

        {data.clientType === 'individual' && data.clientSource && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('contractNumber')}
            </label>
            <input
              type="text"
              value={data.contractNumber}
              onChange={(e) => onUpdate({ contractNumber: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="№"
              readOnly={isAggregatorSource && data.aggregatorClientId}
            />
          </div>
        )}

        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={data.hasDeposit}
              onChange={(e) => onUpdate({ hasDeposit: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">{t('depositSystem')}</span>
          </label>
        </div>

        <div className="pt-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">{t('route')}</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('from')}
              </label>
              <select
                value={data.fromStation}
                onChange={(e) => onUpdate({ fromStation: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{t('selectStation')}</option>
                <option value="almaty">Алматы-1</option>
                <option value="astana">Астана Нұрлы Жол</option>
                <option value="shymkent">Шымкент</option>
                <option value="aktobe">Ақтөбе</option>
                <option value="karaganda">Қарағанды</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('to')}
              </label>
              <select
                value={data.toStation}
                onChange={(e) => onUpdate({ toStation: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{t('selectStation')}</option>
                <option value="almaty">Алматы-1</option>
                <option value="astana">Астана Нұрлы Жол</option>
                <option value="shymkent">Шымкент</option>
                <option value="aktobe">Ақтөбе</option>
                <option value="karaganda">Қарағанды</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('departureDate')}
            </label>
            <input
              type="date"
              value={data.departureDate}
              onChange={(e) => onUpdate({ departureDate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            onClick={onNext}
            disabled={!data.clientName || !data.fromStation || !data.toStation || !data.departureDate}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {t('next')}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}