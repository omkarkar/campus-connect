    import React, { useState } from 'react';
    import { Box, CssBaseline } from '@mui/material';
    import { observer } from 'mobx-react-lite';
    import Header from './Header';
    import Sidebar from './Sidebar';
    import { useAuthStore } from '../../store/mob/RootStore';

    interface LayoutProps {
        children: React.ReactNode;
    }

    export const Layout = observer(({ children }: LayoutProps) => {
        const authStore = useAuthStore();
        const [mobileOpen, setMobileOpen] = useState(true);

        const handleDrawerToggle = () => {
            setMobileOpen(!mobileOpen);
            console.log("sidebar button click")
        };

        console.log("drawer open :"+ mobileOpen)

        return (
            <Box sx={{ display: 'flex', minHeight: '100vh' }}>
                <CssBaseline />
                    <>
                        {/* Use the original Header component directly */}
                        <Header onMenuClick={handleDrawerToggle} />
                        <Sidebar
                            mobileOpen={mobileOpen}
                            onMobileClose={handleDrawerToggle}
                        />
                    </>
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        backgroundColor: 'background.default',
                        p: 3,
                        // mt: authStore.isAuthenticated ? 8 : 0,
                        mt: 8,
                        // ml: authStore.isAuthenticated ? { sm: 30 } : 0,
                    }}
                >
                    {children}
                </Box>
            </Box>
        );
    });

    export default Layout as React.FC<LayoutProps>;