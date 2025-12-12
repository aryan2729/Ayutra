import axios from 'axios';

// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Session storage keys
const SESSION_KEY = 'auth.session';
const TOKEN_KEY = 'auth.token';
const REFRESH_TOKEN_KEY = 'auth.refreshToken';

/**
 * Auth Configuration - Similar to NextAuth config
 */
export const authConfig = {
  providers: {
    credentials: {
      id: 'credentials',
      name: 'Credentials',
      type: 'credentials',
      authorize: async (credentials) => {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/login`, {
            email: credentials.email,
            password: credentials.password,
            role: credentials.role,
          });

          if (response.data.success) {
            return {
              id: response.data.data.user.id,
              email: response.data.data.user.email,
              name: response.data.data.user.name,
              role: response.data.data.user.role,
              image: response.data.data.user.image,
              token: response.data.data.token,
              refreshToken: response.data.data.refreshToken,
            };
          }
          return null;
        } catch (error) {
          console.error('Login error:', error);
          return null;
        }
      },
    },
    google: {
      id: 'google',
      name: 'Google',
      type: 'oauth',
      authorize: async (credentials) => {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/google`, {
            token: credentials.token,
          });

          if (response.data.success) {
            return {
              id: response.data.data.user.id,
              email: response.data.data.user.email,
              name: response.data.data.user.name,
              role: response.data.data.user.role,
              image: response.data.data.user.image,
              token: response.data.data.token,
              refreshToken: response.data.data.refreshToken,
            };
          }
          return null;
        } catch (error) {
          console.error('Google login error:', error);
          return null;
        }
      },
    },
    apple: {
      id: 'apple',
      name: 'Apple',
      type: 'oauth',
      authorize: async (credentials) => {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/apple`, {
            token: credentials.token,
          });

          if (response.data.success) {
            return {
              id: response.data.data.user.id,
              email: response.data.data.user.email,
              name: response.data.data.user.name,
              role: response.data.data.user.role,
              image: response.data.data.user.image,
              token: response.data.data.token,
              refreshToken: response.data.data.refreshToken,
            };
          }
          return null;
        } catch (error) {
          console.error('Apple login error:', error);
          return null;
        }
      },
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.image = user.image;
        token.accessToken = user.token;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          email: token.email,
          name: token.name,
          role: token.role,
          image: token.image,
        };
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
};

/**
 * Sign in with a provider
 */
export async function signIn(providerId, credentials = {}) {
  const provider = authConfig.providers[providerId];
  if (!provider) {
    throw new Error(`Provider ${providerId} not found`);
  }

  const user = await provider.authorize(credentials);
  if (!user) {
    throw new Error('Authentication failed');
  }

  // Create session
  const session = {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      image: user.image,
    },
    accessToken: user.token,
    refreshToken: user.refreshToken,
    expires: new Date(Date.now() + authConfig.session.maxAge * 1000).toISOString(),
  };

  // Store session
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  localStorage.setItem(TOKEN_KEY, user.token);
  if (user.refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, user.refreshToken);
  }

  return session;
}

/**
 * Sign out
 */
export async function signOut() {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      await axios.post(
        `${API_BASE_URL}/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}

/**
 * Get current session
 */
export function getSession() {
  try {
    const sessionStr = localStorage.getItem(SESSION_KEY);
    if (!sessionStr) return null;

    const session = JSON.parse(sessionStr);
    const expires = new Date(session.expires);

    // Check if session is expired
    if (expires < new Date()) {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      return null;
    }

    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

/**
 * Get session token
 */
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Refresh session token
 */
export async function refreshSession() {
  try {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
      refreshToken,
    });

    if (response.data.success) {
      const session = getSession();
      if (session) {
        session.accessToken = response.data.data.token;
        session.refreshToken = response.data.data.refreshToken;
        session.expires = new Date(
          Date.now() + authConfig.session.maxAge * 1000
        ).toISOString();

        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        localStorage.setItem(TOKEN_KEY, response.data.data.token);
        localStorage.setItem(REFRESH_TOKEN_KEY, response.data.data.refreshToken);

        return session;
      }
    }
    return null;
  } catch (error) {
    console.error('Refresh session error:', error);
    signOut();
    return null;
  }
}

/**
 * Get current user
 */
export async function getCurrentUser() {
  try {
    const token = getToken();
    if (!token) return null;

    const response = await axios.get(`${API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.success) {
      return response.data.data.user;
    }
    return null;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}
