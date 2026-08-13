/// Base class for all domain layer error failures
abstract class Failure {
  final String message;
  const Failure(this.message);
}

/// Server or Network connection failure
class ServerFailure extends Failure {
  const ServerFailure([String message = 'Server connection error occurred']) : super(message);
}

/// Firebase Authentication failure
class AuthFailure extends Failure {
  const AuthFailure([String message = 'Authentication failed']) : super(message);
}

/// Firestore Database failure
class DatabaseFailure extends Failure {
  const DatabaseFailure([String message = 'Database operation failed']) : super(message);
}

/// Vetting or Validation failure
class ValidationFailure extends Failure {
  const ValidationFailure([String message = 'Validation requirements not met']) : super(message);
}
