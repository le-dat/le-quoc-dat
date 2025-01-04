import React, { Suspense, lazy } from "react";
import Loading from "./components/ui/Loading";

const CurrencyConverter = lazy(() => import("./components/CurrencyConverter"));
const ParticleBackground = lazy(() => import("./components/ParticleBackground"));

const App: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <ParticleBackground />
      <Suspense fallback={<Loading />}>
        <CurrencyConverter />
      </Suspense>
    </div>
  );
};

export default App;
