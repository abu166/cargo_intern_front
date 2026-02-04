import { FileText, Download, Calendar } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useState } from 'react';
import { api } from '../lib/api';

export function Reports() {
  const { t } = useLanguage();
  const [fo3, setFo3] = useState<{ total_amount: number; payments_count: number } | null>(null);
  const [auditCount, setAuditCount] = useState<number | null>(null);
  const [routeId, setRouteId] = useState<number | null>(null);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">{t('reportsTitle')}</h1>
        <p className="text-gray-600">{t('reportsDesc')}</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{t('fo3Report')}</h3>
              <p className="text-sm text-gray-600">{t('financialReport')}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="date"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={() => api.fo3Report().then(setFo3)}
            >
              <Download className="w-4 h-4" />
              {t('generate')}
            </button>
            {fo3 && (
              <div className="text-xs text-gray-600 mt-2">
                Всего оплат: {fo3.payments_count}, сумма: {fo3.total_amount} ₸
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{t('shipmentsReport')}</h3>
              <p className="text-sm text-gray-600">{t('generalStats')}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="date"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              <Download className="w-4 h-4" />
              {t('generate')}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{t('auditLog')}</h3>
              <p className="text-sm text-gray-600">{t('userActions')}</p>
            </div>
          </div>
          <div className="space-y-3">
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">{t('allUsers')}</option>
              <option value="user1">Айдана</option>
              <option value="user2">Нұрболат А.С.</option>
            </select>
            <div className="flex gap-2">
              <input
                type="date"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              onClick={() => api.auditLogs().then((logs) => setAuditCount(logs.length))}
            >
              <Download className="w-4 h-4" />
              {t('export')}
            </button>
            {auditCount !== null && (
              <div className="text-xs text-gray-600 mt-2">
                Записей: {auditCount}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{t('routeReport')}</h3>
              <p className="text-sm text-gray-600">{t('routeAnalysis')}</p>
            </div>
          </div>
          <div className="space-y-3">
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">{t('allRoutes')}</option>
              <option value="almaty-astana">Алматы - Астана</option>
              <option value="almaty-shymkent">Алматы - Шымкент</option>
              <option value="astana-karaganda">Астана - Қарағанды</option>
            </select>
            <div className="flex gap-2">
              <input
                type="date"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              onClick={async () => {
                const plan = await api.createRoutePlan({ origin_station: 'A', destination_station: 'B', wagons_count: 2 });
                await api.approveRoutePlan(plan.id);
                setRouteId(plan.id);
              }}
            >
              <Download className="w-4 h-4" />
              {t('generate')}
            </button>
            {routeId && (
              <div className="text-xs text-gray-600 mt-2">
                Route plan #{routeId} approved
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
