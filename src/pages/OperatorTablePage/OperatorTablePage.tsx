import { useParams, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { OperatorTable } from 'widgets/OperatorTable';
import { mockOperatorGroups } from 'shared/lib/mock/operatorData';

export const OperatorTablePage = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Find the group by ID
  const group = mockOperatorGroups.find(g => g.id === groupId);

  if (!group) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-800 text-center">
          <h1 className="text-2xl font-bold mb-4">{t('groupNotFound')}</h1>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('backToDashboard')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-8 lg:px-20 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <span className="text-lg">←</span>
              <span className="font-medium">{t('back')}</span>
            </button>
            <div className="h-6 w-px bg-gray-300" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              {t('operators')} - {group.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-8 lg:px-20 py-8">
        <OperatorTable operators={group.operators} />
      </div>
    </div>
  );
};
