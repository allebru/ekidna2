const Subscriber = require('../models/Subscriber');
const ActivityLog = require('../models/ActivityLog');
const emailService = require('../services/emailService');
const pdfService = require('../services/pdfService');

class SubscriberController {
  // Create new subscriber (from website form)
  static async create(req, res, next) {
    try {
      const { name, email, phone, address, subscription_year, notes } = req.body;

      // Check if email already exists (if provided)
      if (email) {
        const existing = await Subscriber.findByEmail(email);
        if (existing && existing.status !== 'deleted') {
          return res.status(409).json({
            error: 'A subscriber with this email already exists',
            subscriberId: existing.id
          });
        }
      }

      // Create subscriber
      const subscriber = await Subscriber.create({
        name,
        email,
        phone,
        address,
        subscription_year,
        notes
      });

      // Send confirmation email with membership card (async, don't wait)
      if (email) {
        // Generate membership card PDF and send with email
        (async () => {
          try {
            console.log('🎫 Generating membership card for:', subscriber.name);

            // Generate the membership card PDF
            const membershipCardPdf = await pdfService.generateMembershipCard({
              name: subscriber.name,
              serialNumber: subscriber.serial_number,
              year: subscriber.subscription_year
            });

            console.log('✅ Membership card generated successfully');

            // Prepare attachment for email
            const attachments = [{
              filename: `Tessera_Ekidna_${subscriber.subscription_year}_${String(subscriber.serial_number).padStart(5, '0')}.pdf`,
              content: membershipCardPdf,
              contentType: 'application/pdf'
            }];

            // Send confirmation email with attachment
            await emailService.sendSubscriptionConfirmation(subscriber, attachments);
            console.log('✅ Confirmation email sent with membership card');
          } catch (err) {
            console.error('❌ Failed to generate/send membership card:', err);
          }
        })();

        // Send notification to staff (async)
        emailService.sendStaffNotification(subscriber).catch(err => {
          console.error('Failed to send staff notification:', err);
        });
      }

      res.status(201).json({
        success: true,
        message: 'Subscription created successfully',
        subscriber: {
          id: subscriber.id,
          name: subscriber.name,
          email: subscriber.email,
          subscription_year: subscriber.subscription_year,
          serial_number: subscriber.serial_number
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get all subscribers (staff only)
  static async getAll(req, res, next) {
    try {
      const { page, limit, status, subscription_year, search } = req.query;

      const result = await Subscriber.findAll({
        page,
        limit,
        status,
        subscription_year,
        search
      });

      res.json({
        success: true,
        ...result
      });
    } catch (error) {
      next(error);
    }
  }

  // Get subscriber by ID
  static async getById(req, res, next) {
    try {
      const { id } = req.params;

      const subscriber = await Subscriber.findById(id);

      if (!subscriber) {
        return res.status(404).json({ error: 'Subscriber not found' });
      }

      // Get activity logs for this subscriber
      const logs = await ActivityLog.getBySubscriber(id, 10);

      res.json({
        success: true,
        subscriber,
        activity_logs: logs
      });
    } catch (error) {
      next(error);
    }
  }

  // Update subscriber
  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { name, email, phone, address, subscription_year, notes } = req.body;

      // Check if subscriber exists
      const existing = await Subscriber.findById(id);
      if (!existing) {
        return res.status(404).json({ error: 'Subscriber not found' });
      }

      // Update subscriber
      const updated = await Subscriber.update(id, {
        name,
        email,
        phone,
        address,
        subscription_year,
        notes
      });

      // Log activity
      await ActivityLog.create({
        staff_user_id: req.user.id,
        subscriber_id: id,
        action: 'subscriber_updated',
        details: { old: existing, new: updated },
        ip_address: req.ip
      });

      res.json({
        success: true,
        message: 'Subscriber updated successfully',
        subscriber: updated
      });
    } catch (error) {
      next(error);
    }
  }

  // Soft delete subscriber
  static async softDelete(req, res, next) {
    try {
      const { id } = req.params;

      const subscriber = await Subscriber.findById(id);
      if (!subscriber) {
        return res.status(404).json({ error: 'Subscriber not found' });
      }

      if (subscriber.status === 'deleted') {
        return res.status(400).json({ error: 'Subscriber already deleted' });
      }

      const deleted = await Subscriber.softDelete(id, req.user.id);

      // Log activity
      await ActivityLog.create({
        staff_user_id: req.user.id,
        subscriber_id: id,
        action: 'subscriber_deleted',
        details: { subscriber: subscriber.name },
        ip_address: req.ip
      });

      res.json({
        success: true,
        message: 'Subscriber deleted successfully',
        subscriber: deleted
      });
    } catch (error) {
      next(error);
    }
  }

  // Restore deleted subscriber
  static async restore(req, res, next) {
    try {
      const { id } = req.params;

      const subscriber = await Subscriber.findById(id);
      if (!subscriber) {
        return res.status(404).json({ error: 'Subscriber not found' });
      }

      if (subscriber.status !== 'deleted') {
        return res.status(400).json({ error: 'Subscriber is not deleted' });
      }

      const restored = await Subscriber.restore(id);

      // Log activity
      await ActivityLog.create({
        staff_user_id: req.user.id,
        subscriber_id: id,
        action: 'subscriber_restored',
        details: { subscriber: subscriber.name },
        ip_address: req.ip
      });

      res.json({
        success: true,
        message: 'Subscriber restored successfully',
        subscriber: restored
      });
    } catch (error) {
      next(error);
    }
  }

  // Get statistics
  static async getStats(req, res, next) {
    try {
      const stats = await Subscriber.getStats();

      res.json({
        success: true,
        stats
      });
    } catch (error) {
      next(error);
    }
  }

  // Get subscribers by year
  static async getByYear(req, res, next) {
    try {
      const { year } = req.params;

      const subscribers = await Subscriber.getByYear(parseInt(year));

      res.json({
        success: true,
        year: parseInt(year),
        count: subscribers.length,
        subscribers
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = SubscriberController;
