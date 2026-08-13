/// Abstract UseCase interface following Clean Architecture domain contract.
abstract class UseCase<Type, Params> {
  Future<Type> call(Params params);
}

/// Class used when a UseCase does not require any parameters
class NoParams {
  const NoParams();
}
