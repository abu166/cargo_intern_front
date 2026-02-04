import { useLanguage } from '../contexts/LanguageContext';
import { Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { api } from '../lib/api';

export function Settings() {
  const { t, language, setLanguage } = useLanguage();
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [newUser, setNewUser] = useState({ username: '', password: '', full_name: '', roles: 'AGENT' });

  const loadUsers = () => {
    api.listUsers().then(setUsers).catch(() => setUsers([]));
  };

  useEffect(() => {
    if (user?.roles?.includes('ADMIN')) {
      loadUsers();
    }
  }, [user?.roles]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">{t('settingsTitle')}</h1>
        <p className="text-gray-600">{t('settingsDesc')}</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-2xl">
        <div className="space-y-6">
          {user?.roles?.includes('ADMIN') && (
            <div className="pb-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Users</h3>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <input
                  type="text"
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="username"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                />
                <input
                  type="password"
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                />
                <input
                  type="text"
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="full name"
                  value={newUser.full_name}
                  onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                />
                <input
                  type="text"
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="roles (comma)"
                  value={newUser.roles}
                  onChange={(e) => setNewUser({ ...newUser, roles: e.target.value })}
                />
              </div>
              <button
                onClick={async () => {
                  await api.createUser({
                    username: newUser.username,
                    password: newUser.password,
                    full_name: newUser.full_name || undefined,
                    roles: newUser.roles.split(',').map((r) => r.trim()).filter(Boolean),
                  });
                  setNewUser({ username: '', password: '', full_name: '', roles: 'AGENT' });
                  loadUsers();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                Create user
              </button>
              <div className="mt-4 space-y-2">
                {users.map((u) => (
                  <div key={u.id} className="p-3 border border-gray-200 rounded-lg flex items-center gap-3">
                    <div className="flex-1 text-sm text-gray-700">{u.username}</div>
                    <input
                      className="px-2 py-1 border border-gray-300 rounded text-xs"
                      defaultValue={u.full_name || ''}
                      onBlur={(e) => api.updateUser(u.id, { full_name: e.target.value }).then(loadUsers)}
                    />
                    <input
                      className="px-2 py-1 border border-gray-300 rounded text-xs"
                      defaultValue={(u.roles || []).join(',')}
                      onBlur={(e) =>
                        api.updateUser(u.id, { roles: e.target.value.split(',').map((r: string) => r.trim()).filter(Boolean) }).then(loadUsers)
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Language Settings */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {t('languageSettings')}
            </label>
            <div className="space-y-2">
              <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="language"
                  value="ru"
                  checked={language === 'ru'}
                  onChange={(e) => setLanguage(e.target.value as 'ru' | 'en' | 'kk')}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="ml-3 text-sm text-gray-900">Русский</span>
              </label>
              <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="language"
                  value="en"
                  checked={language === 'en'}
                  onChange={(e) => setLanguage(e.target.value as 'ru' | 'en' | 'kk')}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="ml-3 text-sm text-gray-900">English</span>
              </label>
              <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="language"
                  value="kk"
                  checked={language === 'kk'}
                  onChange={(e) => setLanguage(e.target.value as 'ru' | 'en' | 'kk')}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="ml-3 text-sm text-gray-900">Қазақша</span>
              </label>
            </div>
          </div>

          {/* Theme Settings */}
          <div className="pt-6 border-t border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {t('themeSettings')}
            </label>
            <div className="space-y-2">
              <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="theme"
                  value="light"
                  defaultChecked
                  className="w-4 h-4 text-blue-600"
                />
                <span className="ml-3 text-sm text-gray-900">{t('light')}</span>
              </label>
              <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="theme"
                  value="dark"
                  className="w-4 h-4 text-blue-600"
                />
                <span className="ml-3 text-sm text-gray-900">{t('dark')}</span>
              </label>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="pt-6 border-t border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {t('notificationSettings')}
            </label>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <span className="text-sm text-gray-900">{t('emailNotifications')}</span>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </label>
              <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <span className="text-sm text-gray-900">{t('smsNotifications')}</span>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </label>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-6">
            <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Save className="w-5 h-5" />
              {t('saveSettings')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
