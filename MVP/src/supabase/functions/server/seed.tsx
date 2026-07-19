import * as kv from "./kv_store.tsx";

export async function seedSubscribers() {
  const sampleSubscribers = [
    {
      id: crypto.randomUUID(),
      name: "Marco Bianchi",
      email: "marco.bianchi@email.it",
      phone: "+39 333 1234567",
      address: "Via Roma 10, Milano",
      subscription_year: 2025,
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: crypto.randomUUID(),
      name: "Laura Rossi",
      email: "laura.rossi@email.it",
      phone: "+39 340 7654321",
      address: "Corso Vittorio Emanuele 25, Roma",
      subscription_year: 2025,
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: crypto.randomUUID(),
      name: "Giuseppe Verdi",
      email: "giuseppe.verdi@email.it",
      phone: "+39 348 9876543",
      address: "Piazza Duomo 5, Firenze",
      subscription_year: 2024,
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: crypto.randomUUID(),
      name: "Sofia Ferrari",
      email: "sofia.ferrari@email.it",
      phone: "+39 335 5551234",
      address: "Via Garibaldi 15, Napoli",
      subscription_year: 2025,
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: crypto.randomUUID(),
      name: "Antonio Esposito",
      email: "antonio.esposito@email.it",
      phone: "+39 347 8887777",
      address: "Viale della Repubblica 30, Bologna",
      subscription_year: 2024,
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: crypto.randomUUID(),
      name: "Francesca Colombo",
      email: "francesca.colombo@email.it",
      phone: "+39 333 4445555",
      address: "Via Torino 8, Torino",
      subscription_year: 2023,
      status: "deleted",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  // Store each subscriber
  for (const subscriber of sampleSubscribers) {
    await kv.set(`subscriber:${subscriber.id}`, subscriber);
  }

  return sampleSubscribers;
}
