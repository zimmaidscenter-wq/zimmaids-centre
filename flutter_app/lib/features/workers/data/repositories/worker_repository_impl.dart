import '../../domain/entities/worker.dart';
import '../../domain/repositories/worker_repository.dart';
import '../models/worker_model.dart';

/// Concrete implementation of WorkerRepository
class WorkerRepositoryImpl implements WorkerRepository {
  // Mock dataset matching real Zimbabwe Maids Centre profiles
  final List<WorkerModel> _mockWorkers = const [
    WorkerModel(
      id: 'w1',
      fullName: 'Tariro Moyo',
      primaryCategory: 'Caregiver / Nurse Aide',
      city: 'Harare',
      trustScore: 98,
      monthlyWageUSD: 280.0,
      rating: 4.9,
      reviewCount: 24,
      zrpCidVerified: true,
      redCrossCertified: true,
      idVerified: true,
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
      bio: 'Certified Red Cross Nurse Aide with 6 years experience in eldercare and home nursing in Borrowdale & Avondale.',
    ),
    WorkerModel(
      id: 'w2',
      fullName: 'Chipo Sibanda',
      primaryCategory: 'Childcare / Nanny',
      city: 'Bulawayo',
      trustScore: 95,
      monthlyWageUSD: 240.0,
      rating: 4.85,
      reviewCount: 18,
      zrpCidVerified: true,
      redCrossCertified: true,
      idVerified: true,
      avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=400',
      bio: 'Dedicated nanny skilled in infant care, early childhood development, and meal preparation.',
    ),
    WorkerModel(
      id: 'w3',
      fullName: 'Blessing Ndlovu',
      primaryCategory: 'Housekeeper / Cook',
      city: 'Harare',
      trustScore: 92,
      monthlyWageUSD: 250.0,
      rating: 4.75,
      reviewCount: 15,
      zrpCidVerified: true,
      redCrossCertified: false,
      idVerified: true,
      avatarUrl: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&q=80&w=400',
      bio: 'Professional cook and housekeeper specializing in family meal planning and deep cleaning.',
    ),
  ];

  @override
  Future<List<Worker>> getWorkers({String? category, String? city}) async {
    // Simulate short network latency
    await Future.delayed(const Duration(milliseconds: 300));
    return _mockWorkers.where((w) {
      if (category != null && category.isNotEmpty && category != 'All') {
        if (!w.primaryCategory.contains(category)) return false;
      }
      if (city != null && city.isNotEmpty && city != 'All Cities') {
        if (w.city != city) return false;
      }
      return true;
    }).toList();
  }

  @override
  Future<Worker> getWorkerById(String id) async {
    await Future.delayed(const Duration(milliseconds: 200));
    return _mockWorkers.firstWhere((w) => w.id == id, orElse: () => _mockWorkers.first);
  }
}
