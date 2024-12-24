import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Badge,
    Menu,
    MenuItem,
    Box,
    Avatar,
    InputBase,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Notifications as NotificationsIcon,
    Search as SearchIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import {
    useAuthStore,
    useNotificationsStore
} from '../../store/mob/RootStore';

interface HeaderProps {
    onMenuClick?: () => void;
}

// Create a regular component
function HeaderComponent({ onMenuClick }: HeaderProps) {
    const authStore = useAuthStore();
    const notificationsStore = useNotificationsStore();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        authStore.logout();
        handleMenuClose();
    };

    return (
        <AppBar
            position="fixed"
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                bgcolor: 'background.paper',
                color: 'text.primary',
            }}
        >
            <Toolbar>
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={onMenuClick}
                    sx={{ 
                        mr: 2, 
                        display: { 
                            xs: 'block', 
                            sm: 'block', 
                            md: 'block', 
                            lg: 'block' 
                        } 
                    }}
                >
                    <MenuIcon />
                </IconButton>

                <Typography variant="h6" noWrap component="div" sx={{ display: { xs: 'none', sm: 'block' } }}>
                    Campus Connect
                </Typography>

                <Box sx={{ flexGrow: 1 }} />

                <Box sx={{ position: 'relative', mr: 2 }}>
                    <Box
                        sx={{
                            position: 'relative',
                            borderRadius: 1,
                            bgcolor: 'background.default',
                            '&:hover': { bgcolor: 'action.hover' },
                            mr: 2,
                            width: '100%',
                        }}
                    >
                        <Box sx={{ position: 'absolute', p: 2, height: '100%', display: 'flex', alignItems: 'center' }}>
                            <SearchIcon />
                        </Box>
                        <InputBase
                            placeholder="Search..."
                            sx={{
                                pl: 6,
                                pr: 2,
                                py: 1,
                                width: '300px',
                            }}
                        />
                    </Box>
                </Box>

                <IconButton color="inherit">
                    <Badge badgeContent={notificationsStore.unreadCount} color="error">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>

                <IconButton
                    edge="end"
                    onClick={handleProfileMenuOpen}
                    color="inherit"
                >
                    <Avatar
                        alt={authStore.user?.name}
                        // src={authStore.user?.avatar}
                        sx={{ width: 32, height: 32 }}
                    />
                </IconButton>

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
                    <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

const Header = observer(HeaderComponent) as React.FC<HeaderProps>;

export default Header;
