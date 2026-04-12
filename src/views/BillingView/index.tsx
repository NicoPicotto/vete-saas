import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CreditCard, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { supabase } from "@/lib/supabase";
import { useSubscription } from "@/hooks/useSubscription";
import { Button } from "@/components/ui/button";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const PLANS = [
   {
      id: "mensual" as const,
      label: "Mensual",
      price: "$36.000",
      period: "por mes",
      description: "Renovación mensual, cancelá cuando quieras.",
   },
   {
      id: "anual" as const,
      label: "Anual",
      price: "$360.000",
      period: "pago único",
      description: "2 meses gratis respecto al plan mensual.",
      highlighted: true,
   },
];

export default function BillingView() {
   const [searchParams] = useSearchParams();
   const { subscription, isTrialActive, trialDaysLeft, isLoading, refetch } =
      useSubscription();
   const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

   const paymentStatus = searchParams.get("status");

   async function handleSelectPlan(plan: "mensual" | "anual") {
      setLoadingPlan(plan);
      try {
         const {
            data: { session },
         } = await supabase.auth.getSession();
         if (!session) throw new Error("No hay sesión activa");

         const res = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-preference`,
            {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${session.access_token}`,
                  apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
               },
               body: JSON.stringify({ plan }),
            },
         );

         const data = await res.json();
         if (!res.ok)
            throw new Error(data.error ?? "Error al crear la preferencia");

         window.location.href = data.init_point;
      } catch (err: unknown) {
         const message =
            err instanceof Error ? err.message : "Error inesperado";
         toast.error(message);
         setLoadingPlan(null);
      }
   }

   if (isLoading) {
      return (
         <div className='flex items-center justify-center h-64'>
            <p className='text-muted-foreground'>Cargando...</p>
         </div>
      );
   }

   return (
      <main className='flex items-center justify-center h-screen p-4'>
         <div className='max-w-4xl space-y-6 w-full'>
            <div className='flex items-center gap-3'>
               <CreditCard className='h-6 w-6 text-muted-foreground' />
               <div>
                  <h1 className='text-2xl font-bold'>Suscripción</h1>
                  <p className='text-muted-foreground text-sm'>
                     Gestioná tu plan de VeteVite
                  </p>
               </div>
            </div>

            {/* Feedback post-pago */}
            {paymentStatus === "success" && (
               <div className='flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800'>
                  <CheckCircle2 className='h-5 w-5 shrink-0' />
                  <p className='text-sm'>
                     ¡Pago procesado! Tu suscripción se activará en unos
                     minutos.
                  </p>
               </div>
            )}
            {paymentStatus === "failure" && (
               <div className='flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800'>
                  <AlertCircle className='h-5 w-5 shrink-0' />
                  <p className='text-sm'>
                     El pago no pudo procesarse. Podés intentarlo de nuevo.
                  </p>
               </div>
            )}
            {paymentStatus === "pending" && (
               <div className='flex items-center gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-800'>
                  <Clock className='h-5 w-5 shrink-0' />
                  <p className='text-sm'>
                     Tu pago está siendo procesado. Te avisaremos cuando se
                     confirme.
                  </p>
               </div>
            )}

            {/* Estado actual */}
            <div className='rounded-lg border bg-card p-6 space-y-3'>
               <h2 className='font-semibold'>Estado actual</h2>
               {subscription?.status === "activa" &&
                  subscription.currentPeriodEnd && (
                     <div className='flex items-center gap-3'>
                        <Badge variant='default'>Activa</Badge>
                        <span className='text-sm text-muted-foreground'>
                           Plan {subscription.plan} · Vence el{" "}
                           {format(
                              subscription.currentPeriodEnd,
                              "d 'de' MMMM yyyy",
                              { locale: es },
                           )}
                        </span>
                     </div>
                  )}
               {isTrialActive && (
                  <div className='flex items-center gap-3'>
                     <Badge variant='secondary'>Período de prueba</Badge>
                     <span className='text-sm text-muted-foreground'>
                        Te quedan <strong>{trialDaysLeft} días</strong> de
                        prueba gratuita
                     </span>
                  </div>
               )}
               {!isTrialActive && subscription?.status !== "activa" && (
                  <div className='flex items-center gap-3'>
                     <Badge variant='destructive'>Vencida</Badge>
                     <span className='text-sm text-muted-foreground'>
                        Suscribite para continuar usando VeteVite
                     </span>
                  </div>
               )}
            </div>

            {/* Planes */}
            <div className='space-y-3'>
               <h2 className='font-semibold'>Elegí tu plan</h2>
               <div className='grid gap-4 sm:grid-cols-2'>
                  {PLANS.map((plan) => (
                     <Card
                        key={plan.id}
                        className={
                           plan.highlighted ? "border-primary shadow-sm" : ""
                        }
                     >
                        <CardHeader className='pb-3'>
                           <div className='flex items-center justify-between'>
                              <CardTitle className='text-base'>
                                 {plan.label}
                              </CardTitle>
                              {plan.highlighted && (
                                 <Badge variant='default' className='text-xs'>
                                    Recomendado
                                 </Badge>
                              )}
                           </div>
                           <div className='flex items-baseline gap-1'>
                              <span className='text-2xl font-bold'>
                                 {plan.price}
                              </span>
                              <span className='text-sm text-muted-foreground'>
                                 {plan.period}
                              </span>
                           </div>
                           <CardDescription className='text-xs'>
                              {plan.description}
                           </CardDescription>
                        </CardHeader>
                        <CardContent>
                           <Button
                              className='w-full'
                              variant={plan.highlighted ? "default" : "outline"}
                              disabled={loadingPlan !== null}
                              onClick={() => handleSelectPlan(plan.id)}
                           >
                              {loadingPlan === plan.id
                                 ? "Redirigiendo..."
                                 : "Suscribirme"}
                           </Button>
                        </CardContent>
                     </Card>
                  ))}
               </div>
            </div>
         </div>
      </main>
   );
}
