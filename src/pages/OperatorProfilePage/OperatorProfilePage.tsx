import { useParams, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useRef } from 'react';
import { BackToTop } from 'shared/ui';
import { mockOperatorGroups } from 'shared/lib/mock/operatorData';
import { ProfileHeader } from './ui/ProfileHeader';
import { ProfileStats } from './ui/ProfileStats';
import { ProfileActivity } from './ui/ProfileActivity';
import type { Operator } from 'shared/types';

export const OperatorProfilePage = () => {
  const { operatorId } = useParams<{ operatorId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Find the operator across all groups
  const findOperator = (): Operator | undefined => {
    for (const group of mockOperatorGroups) {
      const operator = group.operators.find(op => op.id === operatorId);
      if (operator) return operator;
    }
    return undefined;
  };

  const operator = findOperator();

  if (!operator) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-black flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">{t('operatorNotFound')}</h1>
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

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div 
      ref={scrollRef}
      className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-black"
    >
      <div className="container mx-auto px-4 py-6">
        <div 
          style={{
            width: '100%',
            maxWidth: '1792px',
            minWidth: '1200px',
            margin: '0 auto'
          }}
          className="space-y-6"
        >
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors mb-6"
          >
            <span className="text-lg">←</span>
            <span className="font-medium">{t('back')}</span>
          </button>

          {/* Profile Header */}
          <ProfileHeader operator={operator} />

          {/* Profile Stats */}
          <ProfileStats operator={operator} />

          {/* Activity Section */}
          <ProfileActivity operator={operator} />
        </div>
      </div>

      {/* Back to Top Button */}
      <BackToTop targetRef={scrollRef} />
    </div>
  );
};
