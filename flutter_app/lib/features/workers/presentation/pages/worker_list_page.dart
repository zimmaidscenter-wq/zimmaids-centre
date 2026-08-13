import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/constants/app_colors.dart';
import '../providers/worker_providers.dart';
import '../widgets/worker_card.dart';

/// Worker Marketplace Page displaying vetted domestic workers with responsive filters
class WorkerListPage extends ConsumerWidget {
  const WorkerListPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final asyncWorkers = ref.watch(workersListProvider);
    final filterState = ref.watch(workerFilterProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Verified Workers Marketplace'),
        actions: [
          IconButton(
            icon: const Icon(Icons.tune),
            onPressed: () => _showFilterModal(context, ref),
          ),
        ],
      ),
      body: Column(
        children: [
          // Filter Chips Row
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            color: AppColors.surface,
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  _buildFilterChip(
                    ref,
                    'All Categories',
                    filterState.selectedCategory == 'All',
                    () => ref.read(workerFilterProvider.notifier).setCategory('All'),
                  ),
                  const SizedBox(width: 8),
                  _buildFilterChip(
                    ref,
                    'Caregivers',
                    filterState.selectedCategory == 'Caregiver',
                    () => ref.read(workerFilterProvider.notifier).setCategory('Caregiver'),
                  ),
                  const SizedBox(width: 8),
                  _buildFilterChip(
                    ref,
                    'Nannies',
                    filterState.selectedCategory == 'Nanny',
                    () => ref.read(workerFilterProvider.notifier).setCategory('Nanny'),
                  ),
                  const SizedBox(width: 8),
                  _buildFilterChip(
                    ref,
                    'Housekeepers',
                    filterState.selectedCategory == 'Housekeeper',
                    () => ref.read(workerFilterProvider.notifier).setCategory('Housekeeper'),
                  ),
                ],
              ),
            ),
          ),

          // Worker List
          Expanded(
            child: asyncWorkers.when(
              data: (workers) {
                if (workers.isEmpty) {
                  return const Center(
                    child: Text('No verified workers found matching your filters.'),
                  );
                }
                return ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: workers.length,
                  itemBuilder: (context, index) {
                    final worker = workers[index];
                    return WorkerCard(
                      worker: worker,
                      onTap: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text('Selected worker: ${worker.fullName}')),
                        );
                      },
                    );
                  },
                );
              },
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (err, stack) => Center(child: Text('Error loading workers: $err')),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterChip(WidgetRef ref, String label, bool isSelected, VoidCallback onTap) {
    return ChoiceChip(
      label: Text(label),
      selected: isSelected,
      onSelected: (_) => onTap(),
      selectedColor: AppColors.primaryContainer,
      labelStyle: TextStyle(
        color: isSelected ? AppColors.primaryDark : AppColors.textSecondary,
        fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
      ),
    );
  }

  void _showFilterModal(BuildContext context, WidgetRef ref) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Filter Workers by Location',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),
              ListTile(
                title: const Text('All Cities (Zimbabwe)'),
                onTap: () {
                  ref.read(workerFilterProvider.notifier).setCity('All Cities');
                  Navigator.pop(context);
                },
              ),
              ListTile(
                title: const Text('Harare Metro'),
                onTap: () {
                  ref.read(workerFilterProvider.notifier).setCity('Harare');
                  Navigator.pop(context);
                },
              ),
              ListTile(
                title: const Text('Bulawayo Metro'),
                onTap: () {
                  ref.read(workerFilterProvider.notifier).setCity('Bulawayo');
                  Navigator.pop(context);
                },
              ),
            ],
          ),
        );
      },
    );
  }
}
