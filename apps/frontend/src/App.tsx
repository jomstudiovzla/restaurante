import { useStore } from '@/stores/useStore';
import { Navigation } from '@/components/Navigation';
import { ConsentBanner } from '@/components/ConsentBanner';
import { MenuView } from '@/features/menu/MenuView';
import { KitchenView } from '@/features/kitchen/KitchenView';
import { MiseEnPlaceView } from '@/features/kitchen/MiseEnPlaceView';
import { POSView } from '@/features/pos/POSView';
import { InventoryView } from '@/features/inventory/InventoryView';
import { CRMView } from '@/features/crm/CRMView';
import { AdminView } from '@/features/admin/AdminView';
import { SaaSAdminView } from '@/features/admin/SaaSAdminView';
import { AdminAuthView } from '@/features/auth/AdminAuthView';
import { OnboardingView } from '@/features/crm/OnboardingView';

function App() {
  const { currentView } = useStore();
  
  const renderView = () => {
    switch (currentView) {
      case 'menu': return <MenuView />;
      case 'miseenplace': return <MiseEnPlaceView />;
      case 'kitchen': return <KitchenView />;
      case 'pos': return <POSView />;
      case 'inventory': return <InventoryView />;
      case 'crm': return <CRMView />;
      case 'onboarding': return <OnboardingView />;
      case 'admin': return <AdminView />;
      case 'saas': return <SaaSAdminView />;
      case 'auth': return <AdminAuthView />;
      default: return <MenuView />;
    }
  };
  
  return (
    <div className="min-h-screen bg-background text-on-background">
      <Navigation />
      <main>
        {renderView()}
      </main>
      <ConsentBanner />
    </div>
  );
}

export default App;
