import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface Subscription {
  id: string;
  userId: string;
  status: 'trial' | 'activa' | 'vencida' | 'cancelada';
  plan: 'mensual' | 'anual' | null;
  trialEndsAt: Date;
  currentPeriodEnd: Date | null;
  mpPaymentId: string | null;
}

async function getSubscription(): Promise<Subscription | null> {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    userId: data.user_id,
    status: data.status,
    plan: data.plan,
    trialEndsAt: new Date(data.trial_ends_at),
    currentPeriodEnd: data.current_period_end ? new Date(data.current_period_end) : null,
    mpPaymentId: data.mp_payment_id,
  };
}

export function useSubscription() {
  const query = useQuery({
    queryKey: ['subscription'],
    queryFn: getSubscription,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  const subscription = query.data ?? null;
  const now = new Date();

  const hasAccess = (() => {
    if (!subscription) return false;
    if (subscription.status === 'activa' && subscription.currentPeriodEnd && subscription.currentPeriodEnd > now) return true;
    if (subscription.status === 'trial' && subscription.trialEndsAt > now) return true;
    return false;
  })();

  const isTrialActive = subscription?.status === 'trial' && subscription.trialEndsAt > now;

  const trialDaysLeft = isTrialActive
    ? Math.ceil((subscription!.trialEndsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return {
    ...query,
    subscription,
    hasAccess,
    isTrialActive,
    trialDaysLeft,
  };
}
