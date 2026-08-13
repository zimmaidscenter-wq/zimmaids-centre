import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/entities/worker.dart';
import '../../domain/repositories/worker_repository.dart';
import '../../data/repositories/worker_repository_impl.dart';

/// Provider for WorkerRepository instance
final workerRepositoryProvider = Provider<WorkerRepository>((ref) {
  return WorkerRepositoryImpl();
});

/// Filter State Class
class WorkerFilterState {
  final String selectedCategory;
  final String selectedCity;

  const WorkerFilterState({
    this.selectedCategory = 'All',
    this.selectedCity = 'All Cities',
  });

  WorkerFilterState copyWith({
    String? selectedCategory,
    String? selectedCity,
  }) {
    return WorkerFilterState(
      selectedCategory: selectedCategory ?? this.selectedCategory,
      selectedCity: selectedCity ?? this.selectedCity,
    );
  }
}

/// StateNotifier for Worker Filters
class WorkerFilterNotifier extends StateNotifier<WorkerFilterState> {
  WorkerFilterNotifier() : super(const WorkerFilterState());

  void setCategory(String category) {
    state = state.copyWith(selectedCategory: category);
  }

  void setCity(String city) {
    state = state.copyWith(selectedCity: city);
  }
}

final workerFilterProvider = StateNotifierProvider<WorkerFilterNotifier, WorkerFilterState>((ref) {
  return WorkerFilterNotifier();
});

/// FutureProvider that fetches filtered workers list automatically
final workersListProvider = FutureProvider<List<Worker>>((ref) async {
  final repo = ref.watch(workerRepositoryProvider);
  final filter = ref.watch(workerFilterProvider);
  return repo.getWorkers(
    category: filter.selectedCategory,
    city: filter.selectedCity,
  );
});
