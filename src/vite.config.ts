import {defineConfig, loadEnv} from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import 'dotenv/config';

// eslint-disable-next-line import/no-anonymous-default-export
export default ({mode}) => {
    process.env = {...process.env, ...loadEnv(mode, process.cwd())};

    const {VITE_NODE_ENV} = process.env;

    return defineConfig({
        mode: VITE_NODE_ENV,
        server: {
            allowedHosts: true,
            hmr: {
                path: '/hmr',
                clientPort: 443
            },
            proxy: {
                '/api': {
                    target: 'http://127.0.0.1:8000',
                    changeOrigin: true,
                    secure: false,
                    configure: (proxy) => {
                        proxy.on('proxyRes', (proxyRes) => {
                            const cookies = proxyRes.headers['set-cookie'];

                            if (!cookies) return;

                            proxyRes.headers['set-cookie'] = cookies.map((cookie) =>
                                cookie
                                    .replace(/;\s*Secure/gi, '')
                                    .replace(/;\s*SameSite=None/gi, '; SameSite=Lax')
                            );
                        });
                    },
                },
            },
        },
        plugins: [react()],
        resolve: {
            alias: {
                '@app': path.resolve(__dirname, './src'),
                '@store': path.resolve(__dirname, './src/store'),
                '@components': path.resolve(__dirname, './src/components'),
                '@layouts': path.resolve(__dirname, './src/layouts'),
                '@modules': path.resolve(__dirname, './src/modules'),
                '@pages': path.resolve(__dirname, './src/pages'),
            },
        },
    });
};
