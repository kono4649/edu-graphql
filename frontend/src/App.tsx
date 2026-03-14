import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '@/shared/components/layout/layout'
import { ProtectedRoute } from '@/shared/components/layout/protected-route'
import LoginPage from '@/pages/Auth/LoginPage'
import RegisterPage from '@/pages/Auth/RegisterPage'
import PlaygroundPage from '@/pages/Playground/PlaygroundPage'
import QueryPage from '@/pages/Learn/QueryPage'
import MutationPage from '@/pages/Learn/MutationPage'
import SubscriptionPage from '@/pages/Learn/SubscriptionPage'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/playground" element={<PlaygroundPage />} />
                  <Route path="/learn/query" element={<QueryPage />} />
                  <Route path="/learn/mutation" element={<MutationPage />} />
                  <Route path="/learn/subscription" element={<SubscriptionPage />} />
                  <Route path="*" element={<Navigate to="/playground" replace />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
