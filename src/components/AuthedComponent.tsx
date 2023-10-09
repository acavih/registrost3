/* import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "~/utils/api";*/
import { Button, AppBar, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import * as React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Container } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu';
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";

export const AuthedComponent = (PageComponent: any) => function AuthedComponent(props) {
  const [drawer, setDrawer] = React.useState(false)
  return (
    <div>
      <AppDrawer drawer={drawer} setDrawer={setDrawer} />
      <AuthedAppBar drawer={drawer} setDrawer={setDrawer} />
      <Toolbar />
      <Container sx={{marginTop: '10px'}} maxWidth={drawer ? 'lg' : 'xl'}>
        <PageComponent {...props} />
      </Container>
    </div>
  )
}

function AppDrawer({drawer, setDrawer}) {
  const pages = [
    {text: 'Usuarios', href: '/admin/users'},
    {text: 'Socios', href: '/admin/partners'},
    {text: 'Últimas atenciones', href: '/admin/lastAttentions'},
    {text: 'Estadísticas', href: '/admin/stats'},
    {text: 'Recursos', href: '/admin/resources'},
  ]
  return (
    <Drawer open={drawer} onClose={() => setDrawer(false)} variant={'persistent'}>
      <Toolbar />
      <List>
        {pages.map(({text, href}) => (
          <ListItem  sx={{minWidth: '250px'}} key={text} disablePadding>
            <ListItemButton href={href}>
              {/* <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon> */}
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  )
}

function AuthedAppBar({drawer, setDrawer}) {
  const router = useRouter()
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar sx={{zIndex: (theme) => theme.zIndex.drawer + 1}} position="fixed">
        <Toolbar>
          <IconButton
            onClick={() => setDrawer(!drawer)}
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Registros
          </Typography>
          <Button variant={'contained'} disableElevation onClick={async () => {
            await signOut({redirect: false})
            router.push('/')
          }} color="error">Logout</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

/*
function AuthShowcase() {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined,
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className={styles.authContainer}>
      <p className={styles.showcaseText}>
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className={styles.loginButton}
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
}
*/