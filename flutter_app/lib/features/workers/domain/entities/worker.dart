/// Domain Entity representing a Vetted Domestic Worker in Zimbabwe
class Worker {
  final String id;
  final String fullName;
  final String primaryCategory;
  final String city;
  final int trustScore;
  final double monthlyWageUSD;
  final double rating;
  final int reviewCount;
  final bool zrpCidVerified;
  final bool redCrossCertified;
  final bool idVerified;
  final String avatarUrl;
  final String bio;

  const Worker({
    required this.id,
    required this.fullName,
    required this.primaryCategory,
    required this.city,
    required this.trustScore,
    required this.monthlyWageUSD,
    required this.rating,
    required this.reviewCount,
    required this.zrpCidVerified,
    required this.redCrossCertified,
    required this.idVerified,
    required this.avatarUrl,
    required this.bio,
  });
}
