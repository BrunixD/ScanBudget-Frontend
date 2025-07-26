import React from 'react';
import { SignedIn, SignedOut, SignIn, UserButton, ClerkLoaded } from '@clerk/clerk-react';
import { ScanBudgetApp } from './ScanBudgetApp';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <header className="w-full max-w-4xl flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">🧠 ScanBudget</h1>
          <SignedIn>
            <UserButton afterSignOutUrl="/"/>
          </SignedIn>
      </header>
      
      <main className="w-full max-w-4xl">
        <SignedIn>
          <ScanBudgetApp />
        </SignedIn>
        <SignedOut>
          <div className="flex justify-center">
            {/* O ClerkLoaded espera até que tudo esteja pronto antes de tentar renderizar */}
            <ClerkLoaded>
              <SignIn />
            </ClerkLoaded>
          </div>
        </SignedOut>
      </main>
    </div>
  );
}

export default App;