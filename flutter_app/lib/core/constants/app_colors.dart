import 'package:flutter/material.dart';

/// App-wide color palette adhering to Material Design 3 guidelines
/// with Zimbabwe Maids Centre emerald and warm gold branding accents.
class AppColors {
  // Primary Emerald Colors
  static const Color primary = Color(0xFF047857); // Emerald 700
  static const Color primaryDark = Color(0xFF064E3B); // Emerald 900
  static const Color primaryLight = Color(0xFF34D399); // Emerald 400
  static const Color primaryContainer = Color(0xFFD1FAE5); // Emerald 100

  // Secondary Gold & Accent Colors
  static const Color secondary = Color(0xFFD97706); // Amber 600
  static const Color secondaryLight = Color(0xFFFBBF24); // Amber 400
  static const Color secondaryContainer = Color(0xFFFEF3C7); // Amber 100

  // Neutral Canvas Colors
  static const Color background = Color(0xFFF8FAFC); // Slate 50
  static const Color surface = Color(0xFFFFFFFF); // White
  static const Color surfaceDark = Color(0xFF0F172A); // Slate 900

  // Text & Border Colors
  static const Color textPrimary = Color(0xFF0F172A); // Slate 900
  static const Color textSecondary = Color(0xFF475569); // Slate 600
  static const Color textMuted = Color(0xFF94A3B8); // Slate 400
  static const Color border = Color(0xFFE2E8F0); // Slate 200

  // Status & Financial Indicators
  static const Color success = Color(0xFF10B981); // Green
  static const Color warning = Color(0xFFF59E0B); // Amber
  static const Color error = Color(0xFFEF4444); // Red
  static const Color info = Color(0xFF0284C7); // Sky Blue
}
