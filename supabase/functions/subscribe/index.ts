import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import mailchimp from 'npm:@mailchimp/mailchimp_marketing@3.0.80';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    // Initialize Mailchimp
    mailchimp.setConfig({
      apiKey: Deno.env.get('MAILCHIMP_API_KEY'),
      server: Deno.env.get('MAILCHIMP_SERVER_PREFIX'), // e.g., 'us1'
    });

    // Add member to list
    const response = await mailchimp.lists.addListMember(
      Deno.env.get('MAILCHIMP_LIST_ID')!,
      {
        email_address: email,
        status: 'subscribed',
      }
    );

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Successfully subscribed to newsletter' 
      }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      }
    );
  } catch (error) {
    console.error('Subscription error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to subscribe' 
      }),
      { 
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
  }
});