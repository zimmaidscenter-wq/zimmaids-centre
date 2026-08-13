import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../workers/presentation/pages/worker_list_page.dart';

/// Primary Dashboard Home Page with Bottom Navigation Bar
class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int _currentIndex = 0;

  final List<Widget> _pages = [
    const WorkerListPage(),
    const _EscrowPlaceholderPage(),
    const _VettingPlaceholderPage(),
    const _ReportsPlaceholderPage(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _pages,
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        type: BottomNavigationBarType.fixed,
        selectedItemColor: AppColors.primary,
        unselectedItemColor: AppColors.textMuted,
        selectedLabelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
        unselectedLabelStyle: const TextStyle(fontSize: 12),
        items: const [
          BottomNavigationBarThemeData(
            items: [
              BottomNavigationBarItem(
                icon: Icon(Icons.people_outline),
                activeIcon: Icon(Icons.people),
                label: 'Workers',
              ),
              BottomNavigationBarItem(
                icon: Icon(Icons.account_balance_wallet_outlined),
                activeIcon: Icon(Icons.account_balance_wallet),
                label: 'Escrow',
              ),
              BottomNavigationBarItem(
                icon: Icon(Icons.verified_user_outlined),
                activeIcon: Icon(Icons.verified_user),
                label: 'ZRP CID Vetting',
              ),
              BottomNavigationBarItem(
                icon: Icon(Icons.bar_chart_outlined),
                activeIcon: Icon(Icons.bar_chart),
                label: 'Reports',
              ),
            ],
          )
        ].first.items!,
      ),
    );
  }
}

class _EscrowPlaceholderPage extends StatelessWidget {
  const _EscrowPlaceholderPage();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Escrow Vaults')),
      body: const Center(
        child: Text(
          'Escrow Vault Module\n(EcoCash, ZIPIT, InnBucks, Mukuru)',
          textAlign: TextAlign.center,
          style: TextStyle(fontSize: 16, color: AppColors.textSecondary),
        ),
      ),
    );
  }
}

class _VettingPlaceholderPage extends StatelessWidget {
  const _VettingPlaceholderPage();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('ZRP CID Vetting')),
      body: const Center(
        child: Text(
          'ZRP CID Clearance & Verification Module',
          textAlign: TextAlign.center,
          style: TextStyle(fontSize: 16, color: AppColors.textSecondary),
        ),
      ),
    );
  }
}

class _ReportsPlaceholderPage extends StatelessWidget {
  const _ReportsPlaceholderPage();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Performance Reports')),
      body: const Center(
        child: Text(
          'D3 & Recharts Visual Performance Module',
          textAlign: TextAlign.center,
          style: TextStyle(fontSize: 16, color: AppColors.textSecondary),
        ),
      ),
    );
  }
}
