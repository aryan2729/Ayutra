# Auth.js Style Authentication Setup

This project uses an Auth.js-style authentication system built for React + Vite, providing a NextAuth-like API.

## Features

- ✅ Session management with JWT tokens
- ✅ Multiple authentication providers (Credentials, Google, Apple)
- ✅ Protected routes
- ✅ Automatic token refresh
- ✅ `useSession` hook (NextAuth-style API)
- ✅ Session persistence
- ✅ Role-based access control

## Usage

### 1. Using `useSession` Hook

```jsx
import { useSession } from '../contexts/AuthContext';

function MyComponent() {
  const { data, status, signIn, signOut } = useSession();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    return <div>Please sign in</div>;
  }

  return (
    <div>
      <p>Welcome, {data.user.name}!</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

### 2. Using `useAuth` Hook (Convenience)

```jsx
import { useAuth } from '../hooks/useAuth';

function MyComponent() {
  const { user, isAuthenticated, signOut } = useAuth();

  if (!isAuthenticated) {
    return <div>Please sign in</div>;
  }

  return (
    <div>
      <p>Welcome, {user.name}!</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

### 3. Protected Routes

```jsx
import { ProtectedRoute } from '../components/ProtectedRoute';

// Protect a route
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>

// Protect with role requirement
<Route 
  path="/admin" 
  element={
    <ProtectedRoute requiredRole="Admin">
      <AdminPanel />
    </ProtectedRoute>
  } 
/>
```

### 4. Sign In

```jsx
import { useSession } from '../contexts/AuthContext';

function LoginForm() {
  const { signIn } = useSession();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await signIn('credentials', {
      email: 'user@example.com',
      password: 'password123',
      role: 'Admin',
    });

    if (result.success) {
      // Redirect to dashboard
      navigate('/dashboard');
    } else {
      // Show error
      console.error(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
    </form>
  );
}
```

### 5. Sign Out

```jsx
import { useSession } from '../contexts/AuthContext';

function LogoutButton() {
  const { signOut } = useSession();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return <button onClick={handleLogout}>Sign Out</button>;
}
```

## Configuration

### Auth Configuration (`src/lib/auth.js`)

The auth configuration is similar to NextAuth's config:

```javascript
export const authConfig = {
  providers: {
    credentials: { /* ... */ },
    google: { /* ... */ },
    apple: { /* ... */ },
  },
  callbacks: {
    jwt: ({ token, user }) => { /* ... */ },
    session: ({ session, token }) => { /* ... */ },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
};
```

### Environment Variables

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## API Endpoints

The authentication system expects the following backend endpoints:

- `POST /api/auth/login` - Login with credentials
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Get current user
- `POST /api/auth/google` - Google OAuth
- `POST /api/auth/apple` - Apple OAuth

## Session Management

- Sessions are stored in `localStorage`
- Automatic token refresh when session is about to expire
- Automatic cleanup of expired sessions
- Session data includes: `user`, `accessToken`, `refreshToken`, `expires`

## Provider Setup

### Credentials Provider

Already configured. Uses email/password/role for authentication.

### Google OAuth

To implement Google OAuth:

1. Set up Google OAuth in your backend
2. Implement the OAuth flow in your frontend
3. Call `signIn('google', { token: googleToken })`

### Apple OAuth

To implement Apple OAuth:

1. Set up Apple OAuth in your backend
2. Implement the OAuth flow in your frontend
3. Call `signIn('apple', { token: appleToken })`

## Differences from NextAuth.js

Since this is React + Vite (not Next.js), some differences:

- No server-side session management (client-side only)
- Uses `localStorage` instead of cookies
- No built-in OAuth providers (requires manual implementation)
- No database adapters (uses API calls)

## Migration from Custom Auth

If you were using the previous custom auth system:

1. Replace `authAPI.login()` with `signIn('credentials', {...})`
2. Replace `localStorage.getItem('authToken')` with `useSession()` hook
3. Wrap protected routes with `<ProtectedRoute>`
4. Use `useSession()` or `useAuth()` hooks instead of direct API calls

## Example: Complete Login Flow

```jsx
import { useSession } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const { signIn, status } = useSession();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (status === 'authenticated') {
      navigate('/dashboard');
    }
  }, [status, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signIn('credentials', {
      email,
      password,
      role: 'Admin',
    });

    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input 
        type="password" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Sign In</button>
    </form>
  );
}
```
