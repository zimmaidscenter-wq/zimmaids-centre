import '../entities/worker.dart';

/// Contract interface for Worker Repository following Clean Architecture
abstract class WorkerRepository {
  Future<List<Worker>> getWorkers({String? category, String? city});
  Future<Worker> getWorkerById(String id);
}
