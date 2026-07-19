import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";
import { seedSubscribers } from "./seed.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-cd70e814/health", (c) => {
  return c.json({ status: "ok" });
});

// Seed endpoint (for development/testing - requires auth)
app.post("/make-server-cd70e814/seed", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      console.log(`Authorization error while seeding data: ${authError?.message}`);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const subscribers = await seedSubscribers();
    
    return c.json({ success: true, count: subscribers.length, subscribers });
  } catch (error) {
    console.log(`Error seeding data: ${error}`);
    return c.json({ error: "Failed to seed data" }, 500);
  }
});

// Sign up endpoint
app.post("/make-server-cd70e814/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    if (!email || !password || !name) {
      return c.json({ error: "Email, password, and name are required" }, 400);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log(`Error creating user during signup: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ success: true, user: data.user });
  } catch (error) {
    console.log(`Unexpected error during signup: ${error}`);
    return c.json({ error: "Failed to create user" }, 500);
  }
});

// Get all subscribers (requires auth)
app.get("/make-server-cd70e814/subscribers", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      console.log(`Authorization error while fetching subscribers: ${authError?.message}`);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Get all subscribers from KV store
    const subscribers = await kv.getByPrefix('subscriber:');
    
    return c.json({ subscribers: subscribers || [] });
  } catch (error) {
    console.log(`Error fetching subscribers: ${error}`);
    return c.json({ error: "Failed to fetch subscribers" }, 500);
  }
});

// Create a new subscriber (requires auth)
app.post("/make-server-cd70e814/subscribers", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      console.log(`Authorization error while creating subscriber: ${authError?.message}`);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { name, email, phone, address, subscription_year } = await c.req.json();
    
    if (!name || !subscription_year) {
      return c.json({ error: "Name and subscription year are required" }, 400);
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    
    const subscriber = {
      id,
      name,
      email: email || '',
      phone: phone || '',
      address: address || '',
      subscription_year,
      status: 'active',
      created_at: now,
      updated_at: now
    };

    await kv.set(`subscriber:${id}`, subscriber);
    
    return c.json({ success: true, subscriber });
  } catch (error) {
    console.log(`Error creating subscriber: ${error}`);
    return c.json({ error: "Failed to create subscriber" }, 500);
  }
});

// Update subscriber (requires auth)
app.put("/make-server-cd70e814/subscribers/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      console.log(`Authorization error while updating subscriber: ${authError?.message}`);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const id = c.req.param('id');
    const updates = await c.req.json();
    
    const existingSubscriber = await kv.get(`subscriber:${id}`);
    
    if (!existingSubscriber) {
      return c.json({ error: "Subscriber not found" }, 404);
    }

    const updatedSubscriber = {
      ...existingSubscriber,
      ...updates,
      id: existingSubscriber.id, // Preserve original ID
      created_at: existingSubscriber.created_at, // Preserve creation date
      updated_at: new Date().toISOString()
    };

    await kv.set(`subscriber:${id}`, updatedSubscriber);
    
    return c.json({ success: true, subscriber: updatedSubscriber });
  } catch (error) {
    console.log(`Error updating subscriber: ${error}`);
    return c.json({ error: "Failed to update subscriber" }, 500);
  }
});

// Soft delete subscriber (requires auth)
app.delete("/make-server-cd70e814/subscribers/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      console.log(`Authorization error while deleting subscriber: ${authError?.message}`);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const id = c.req.param('id');
    
    const existingSubscriber = await kv.get(`subscriber:${id}`);
    
    if (!existingSubscriber) {
      return c.json({ error: "Subscriber not found" }, 404);
    }

    // Soft delete by updating status
    const deletedSubscriber = {
      ...existingSubscriber,
      status: 'deleted',
      updated_at: new Date().toISOString()
    };

    await kv.set(`subscriber:${id}`, deletedSubscriber);
    
    return c.json({ success: true, subscriber: deletedSubscriber });
  } catch (error) {
    console.log(`Error deleting subscriber: ${error}`);
    return c.json({ error: "Failed to delete subscriber" }, 500);
  }
});

Deno.serve(app.fetch);