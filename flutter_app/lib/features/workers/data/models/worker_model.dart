import '../../domain/entities/worker.dart';

/// Data Model extending Worker entity with JSON / Firestore serialization
class WorkerModel extends Worker {
  const WorkerModel({
    required super.id,
    required super.fullName,
    required super.primaryCategory,
    required super.city,
    required super.trustScore,
    required super.monthlyWageUSD,
    required super.rating,
    required super.reviewCount,
    required super.zrpCidVerified,
    required super.redCrossCertified,
    required super.idVerified,
    required super.avatarUrl,
    required super.bio,
  });

  factory WorkerModel.fromJson(Map<String, dynamic> json, String documentId) {
    return WorkerModel(
      id: documentId,
      fullName: json['fullName'] ?? 'Anonymous Worker',
      primaryCategory: json['primaryCategory'] ?? 'Domestic worker',
      city: json['city'] ?? 'Harare',
      trustScore: (json['trustScore'] as num?)?.toInt() ?? 80,
      monthlyWageUSD: (json['monthlyWageUSD'] as num?)?.toDouble() ?? 250.0,
      rating: (json['rating'] as num?)?.toDouble() ?? 4.8,
      reviewCount: (json['reviewCount'] as num?)?.toInt() ?? 12,
      zrpCidVerified: json['zrpCidVerified'] ?? true,
      redCrossCertified: json['redCrossCertified'] ?? true,
      idVerified: json['idVerified'] ?? true,
      avatarUrl: json['avatarUrl'] ?? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
      bio: json['bio'] ?? 'Experienced domestic professional in Zimbabwe.',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'fullName': fullName,
      'primaryCategory': primaryCategory,
      'city': city,
      'trustScore': trustScore,
      'monthlyWageUSD': monthlyWageUSD,
      'rating': rating,
      'reviewCount': reviewCount,
      'zrpCidVerified': zrpCidVerified,
      'redCrossCertified': redCrossCertified,
      'idVerified': idVerified,
      'avatarUrl': avatarUrl,
      'bio': bio,
    };
  }
}
