import { VenueProvider }  from "./store/venueStore";
import { useVenueState }  from "./hooks/useVenueState";
import Header        from "./components/shared/Header";
import ApiKeyBanner  from "./components/ApiKeyBanner/ApiKeyBanner";
import AttendeePanel from "./components/AttendeePanel/AttendeePanel";
import OpsPanel      from "./components/OpsPanel/OpsPanel";

function Inner() {
  useVenueState(); // subscribes to SSE stream, populates store
  return (
    <div className="app-layout">
      <Header />
      <ApiKeyBanner />
      <main className="panels">
        <AttendeePanel />
        <OpsPanel />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <VenueProvider>
      <Inner />
    </VenueProvider>
  );
}
