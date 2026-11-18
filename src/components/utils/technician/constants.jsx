const SERVICE_CATEGORIES = [
  'Smartphone', 'Laptop', 'Air conditioner', 'Refrigerator',
  'Television', 'Washing machine', 'Electrical',
];
const SERVICE_MODES = ['Home Visit', 'Shop Visit'];

// Cleans and validates the form body. Returns { data } or { error }.
// Kept separate so an "edit service" route can reuse it later.
function getServiceInput(body) {
  const data = {
    title: String(body.title || '').trim(),
    category: body.category,
    description: String(body.description || '').trim(),
    image: String(body.image || '').trim(),
    basePrice: Number(body.basePrice),
    estimatedDuration: String(body.estimatedDuration || '').trim(),
    serviceMode: body.serviceMode,
    serviceArea: String(body.serviceArea || '').trim(),
  };

  if (data.title.length < 3 || data.title.length > 100) {
    return { error: 'Title must be 3 to 100 characters' };
  }
  if (!SERVICE_CATEGORIES.includes(data.category)) return { error: 'Select a valid category' };
  if (!Number.isFinite(data.basePrice) || data.basePrice <= 0) {
    return { error: 'Price must be a number above 0' };
  }
  if (!data.estimatedDuration) return { error: 'Estimated time is required' };
  if (!SERVICE_MODES.includes(data.serviceMode)) return { error: 'Select a valid service mode' };
  if (!data.serviceArea) return { error: 'Service area is required' };
  if (data.description.length < 20) {
    return { error: 'Description must be at least 20 characters' };
  }
  if (data.image && !/^https?:\/\/\S+$/i.test(data.image)) {
    return { error: 'Image must be a valid link' };
  }

  return { data };
}

app.post('/services', verifyToken, async (req, res) => {
  try {
    // Role comes from the database, never from the client
    const user = await usersCollection.findOne({ email: req.user.email });
    if (user?.role !== 'technician') {
      return res.status(403).send({ message: 'Only technicians can add services' });
    }

    const { data, error } = getServiceInput(req.body || {});
    if (error) return res.status(400).send({ message: error });

    const service = {
      ...data,
      technicianName: user.name || req.user.name,
      technicianEmail: req.user.email,
      approvalStatus: 'pending', // an admin approves it later
      isAvailable: true,
      createdAt: new Date(),
    };

    const result = await servicesCollection.insertOne(service);
    res.status(201).send({ insertedId: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Failed to add service' });
  }
});