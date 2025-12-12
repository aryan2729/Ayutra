# Auth.js Style Authentication - Quick Start

## ✅ What's Been Set Up

1. **Auth.js-style authentication system** (`src/lib/auth.js`)
2. **Session context and provider** (`src/contexts/AuthContext.jsx`)
3. **Protected routes component** (`src/components/ProtectedRoute.jsx`)
4. **useSession hook** (NextAuth-style API)
5. **useAuth hook** (convenience wrapper)
6. **Updated login page** to use new auth system
7. **All routes protected** by default

## 🚀 Quick Usage Examples

### Check if user is authenticated

```jsx
import { useSession } from '../contexts/AuthContext';

function MyComponent() {
  const { data, status } = useSession();
  
  if (status === 'authenticated') {
    return <div>Welcome, {data.user.name}!</div>;
  }
  
  return <div>Please sign in</div>;
}
```

### Sign out

```jsx
import { useSession } from '../contexts/AuthContext';

function LogoutButton() {
  const { signOut } = useSession();
  
  return (
    <button onClick={() => signOut()}>
      Sign Out
    </button>
  );
}
```

### Access user data anywhere

```jsx
import { useAuth } from '../hooks/useAuth';

function UserProfile() {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) return null;
  
  return (
    <div>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
    </div>
  );
}
```

## 📁 File Structure

```
src/
├── lib/
│   └── auth.js              # Auth configuration & functions
├── contexts/
│   └── AuthContext.jsx       # Session provider & useSession hook
├── components/
│   └── ProtectedRoute.jsx   # Route protection component
├── hooks/
│   └── useAuth.js           # Convenience hook
└── pages/
    └── login/
        └── index.jsx        # Updated login page
```

## 🔑 Key Functions

### From `src/lib/auth.js`:
- `signIn(providerId, credentials)` - Sign in with a provider
- `signOut()` - Sign out
- `getSession()` - Get current session
- `getToken()` - Get access token
- `refreshSession()` - Refresh session token

### From `useSession()` hook:
- `data.session` - Current session object
- `data.user` - Current user object
- `status` - 'loading' | 'authenticated' | 'unauthenticated'
- `loading` - Boolean loading state
- `signIn()` - Sign in function
- `signOut()` - Sign out function

## 🛡️ Protected Routes

All routes except `/` and `/login` are now protected. Users must be authenticated to access them.

To add role-based protection:

```jsx
<Route 
  path="/admin" 
  element={
    <ProtectedRoute requiredRole="Admin">
      <AdminPanel />
    </ProtectedRoute>
  } 
/>
```

## 🔄 Migration Notes

The old `authAPI` functions in `src/services/api.js` are still available for backward compatibility, but you should use the new auth system:

**Old way:**
```jsx
const response = await authAPI.login({ email, password });
```

**New way:**
```jsx
const { signIn } = useSession();
const result = await signIn('credentials', { email, password });
```

## 📝 Next Steps

1. **Test the login flow** - Try logging in with the new system
2. **Add OAuth providers** - Implement Google/Apple OAuth flows
3. **Add role-based checks** - Use `requiredRole` prop on ProtectedRoute
4. **Customize session** - Modify `authConfig` in `src/lib/auth.js`

## 🐛 Troubleshooting

**Session not persisting?**
- Check browser localStorage
- Verify session expiry time in `authConfig`

**Redirect loop?**
- Ensure login page is not protected
- Check ProtectedRoute component logic

**Token not being sent?**
- Verify `getToken()` function works
- Check axios interceptors in `src/services/api.js`
