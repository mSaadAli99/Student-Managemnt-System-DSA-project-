// import { Outlet } from "react-router-dom";

// export default function AuthLayout() {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-100 to-white p-6">
//       <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
//         <div className="hidden md:flex flex-col justify-center px-8">
//           <div className="bg-white rounded-2xl p-8 shadow-md">
//             <h1 className="text-3xl font-bold text-indigo-700">
//               Welcome to CampusHub
//             </h1>
//             <p className="mt-3 text-gray-600">
//               Secure portal for students and teachers. Fast login, clear UI, and
//               role-based signup.
//             </p>
//           </div>
//         </div>

//         <div className="bg-white rounded-2xl p-8 shadow-md">
//           <Outlet />
//         </div>
//       </div>
//     </div>
//   );
// }


import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="login-hero">
      <div className="login-hero__canvas">
        <span className="login-disc login-disc--one" />
        <span className="login-disc login-disc--two" />
        <span className="login-disc login-disc--three" />
      </div>

      <div className="login-shell">
        <section className="login-copy">
          <p className="eyebrow">CampusHub</p>
          <h1>Welcome to your learning hub</h1>
          <p>
            Secure portal for students and teachers. Fast login, clear UI, and role-based
            signup with real-time classroom insights.
          </p>
          <div className="login-bullets">
            <span>Realtime sync</span>
            <span>Role aware</span>
            <span>Secure portal</span>
          </div>
        </section>

        <section className="login-card">
          <header>
            <h2>Sign in</h2>
            <p>Use your CampusHub credentials to continue</p>
          </header>
          <div className="login-card__body">
            <Outlet />
          </div>
        </section>
      </div>
    </div>
  );
}