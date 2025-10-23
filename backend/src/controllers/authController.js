const StaffUser = require('../models/StaffUser');
const ActivityLog = require('../models/ActivityLog');
const { generateToken } = require('../config/jwt');

class AuthController {
  // Login
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await StaffUser.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check if user is active
      if (!user.is_active) {
        return res.status(403).json({ error: 'Account is deactivated' });
      }

      // Verify password
      const isValidPassword = await StaffUser.verifyPassword(password, user.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate token
      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role
      });

      // Log activity
      await ActivityLog.create({
        staff_user_id: user.id,
        action: 'login',
        details: { email: user.email },
        ip_address: req.ip
      });

      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get current user
  static async getCurrentUser(req, res, next) {
    try {
      const user = await StaffUser.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        success: true,
        user
      });
    } catch (error) {
      next(error);
    }
  }

  // Change password
  static async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;

      // Get user with password hash
      const user = await StaffUser.findByEmail(req.user.email);

      // Verify current password
      const isValidPassword = await StaffUser.verifyPassword(currentPassword, user.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }

      // Update password
      await StaffUser.changePassword(req.user.id, newPassword);

      // Log activity
      await ActivityLog.create({
        staff_user_id: req.user.id,
        action: 'password_changed',
        ip_address: req.ip
      });

      res.json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
