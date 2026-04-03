import { Link, useLocation, useNavigate } from "react-router-dom";
import {
   LayoutDashboard,
   Users,
   PawPrint,
   CreditCard,
   Bell,
   Package,
   ShoppingCart,
   CalendarClock,
   LogOut,
   Settings,
} from "lucide-react";
import {
   Sidebar,
   SidebarContent,
   SidebarFooter,
   SidebarGroup,
   SidebarGroupContent,
   SidebarGroupLabel,
   SidebarHeader,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useClinica } from "@/hooks/useClinica";

interface NavItem {
   title: string;
   href: string;
   icon: React.ComponentType<{ className?: string }>;
}

const navigation: NavItem[] = [
   { title: "Dashboard", href: "/", icon: LayoutDashboard },
   { title: "Clientes", href: "/clientes", icon: Users },
   { title: "Mascotas", href: "/mascotas", icon: PawPrint },
   { title: "Productos", href: "/productos", icon: Package },
   { title: "Ventas", href: "/ventas", icon: ShoppingCart },
   { title: "Pagos", href: "/pagos", icon: CreditCard },
   { title: "Turnos", href: "/turnos", icon: CalendarClock },
   { title: "Recordatorios", href: "/recordatorios", icon: Bell },
];

export function AppSidebar() {
   const location = useLocation();
   const navigate = useNavigate();
   const { signOut, user } = useAuth();
   const { data: clinica } = useClinica();

   async function handleLogout() {
      await signOut();
      navigate('/login', { replace: true });
   }

   const clinicaNombre = clinica?.nombre ?? 'Mi Clínica';

   return (
      <Sidebar>
         <SidebarHeader>
            <div className='flex items-center gap-2 px-2 py-1'>
               <PawPrint className='h-6 w-6 text-primary' />
               <span className='text-md font-bold truncate'>{clinicaNombre}</span>
            </div>
         </SidebarHeader>

         <SidebarContent>
            <SidebarGroup>
               <SidebarGroupLabel>Navegación</SidebarGroupLabel>
               <SidebarGroupContent>
                  <SidebarMenu>
                     {navigation.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.href;

                        return (
                           <SidebarMenuItem key={item.title}>
                              <SidebarMenuButton asChild isActive={isActive}>
                                 <Link to={item.href}>
                                    <Icon />
                                    <span>{item.title}</span>
                                 </Link>
                              </SidebarMenuButton>
                           </SidebarMenuItem>
                        );
                     })}
                  </SidebarMenu>
               </SidebarGroupContent>
            </SidebarGroup>
         </SidebarContent>

         <SidebarFooter>
            <div className='flex flex-col gap-1 px-2 py-2'>
               <SidebarMenuButton
                  asChild
                  isActive={location.pathname === '/configuracion'}
                  className='text-muted-foreground'
               >
                  <Link to='/configuracion'>
                     <Settings className='h-4 w-4' />
                     <span>Configuración</span>
                  </Link>
               </SidebarMenuButton>
               <p className='truncate px-2 text-xs text-muted-foreground'>{user?.email}</p>
               <SidebarMenuButton onClick={handleLogout} className='text-muted-foreground'>
                  <LogOut className='h-4 w-4' />
                  <span>Cerrar sesión</span>
               </SidebarMenuButton>
            </div>
         </SidebarFooter>
      </Sidebar>
   );
}
