import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'core/theme/app_theme.dart';
import 'features/home/presentation/pages/home_page.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Note: Firebase.initializeApp() is called here when deployed with options
  runApp(
    const ProviderScope(
      child: ZimbabweMaidsApp(),
    ),
  );
}

/// Root Application Widget for Zimbabwe Maids Centre
class ZimbabweMaidsApp extends StatelessWidget {
  const ZimbabweMaidsApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Zimbabwe Maids Centre',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      home: const HomePage(),
    );
  }
}
