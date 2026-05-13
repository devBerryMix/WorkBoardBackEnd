const mockLeaveRequests = [
  // 이정호 (userId: '1', IT팀)
  { id: '1',  userId: '1',  startDate: '2026-04-21', endDate: '2026-04-21', reason: '병원 방문', status: 'approved', createdAt: '2026-04-18' },
  { id: '2',  userId: '1',  startDate: '2026-05-27', endDate: '2026-05-27', reason: '개인 사정', status: 'approved', createdAt: '2026-05-20' },

  // 김민준 (userId: '2', IT팀)
  { id: '3',  userId: '2',  startDate: '2026-05-07', endDate: '2026-05-08', reason: '가족 행사', status: 'approved', createdAt: '2026-05-01' },

  // 이서준 (userId: '3', IT팀)
  { id: '4',  userId: '3',  startDate: '2026-05-12', endDate: '2026-05-12', reason: '개인 사정', status: 'approved', createdAt: '2026-05-05' },

  // 박지훈 (userId: '4', IT팀)
  { id: '5',  userId: '4',  startDate: '2026-05-07', endDate: '2026-05-07', reason: '병원 방문', status: 'approved', createdAt: '2026-05-02' },

  // 최도윤 (userId: '5', IT팀)
  { id: '6',  userId: '5',  startDate: '2026-05-14', endDate: '2026-05-15', reason: '여행',     status: 'approved', createdAt: '2026-05-03' },

  // 정하준 (userId: '6', IT팀)
  { id: '7',  userId: '6',  startDate: '2026-05-20', endDate: '2026-05-22', reason: '여행',     status: 'pending',  createdAt: '2026-05-10' },

  // 강민서 (userId: '7', IT팀)
  { id: '8',  userId: '7',  startDate: '2026-05-13', endDate: '2026-05-14', reason: '개인 사정', status: 'approved', createdAt: '2026-04-30' },

  // 윤서연 (userId: '8', IT팀)
  { id: '9',  userId: '8',  startDate: '2026-05-26', endDate: '2026-05-27', reason: '가족 행사', status: 'approved', createdAt: '2026-05-10' },

  // 장예준 (userId: '9', IT팀)
  { id: '10', userId: '9',  startDate: '2026-05-20', endDate: '2026-05-21', reason: '병원 방문', status: 'approved', createdAt: '2026-05-05' },

  // 한지우 (userId: '10', IT팀)
  { id: '11', userId: '10', startDate: '2026-05-28', endDate: '2026-05-28', reason: '개인 사정', status: 'approved', createdAt: '2026-05-15' },

  // 김태양 (userId: '11', 테이블게임팀, usedLeaves: 4)
  { id: '12', userId: '11', startDate: '2026-04-14', endDate: '2026-04-15', reason: '병원 방문', status: 'approved', createdAt: '2026-04-10' },
  { id: '13', userId: '11', startDate: '2026-05-06', endDate: '2026-05-07', reason: '개인 사정', status: 'approved', createdAt: '2026-04-30' },

  // 박소미 (userId: '12', 테이블게임팀, usedLeaves: 2)
  { id: '14', userId: '12', startDate: '2026-05-19', endDate: '2026-05-20', reason: '가족 행사', status: 'approved', createdAt: '2026-05-12' },

  // 이현우 (userId: '13', 테이블게임팀, usedLeaves: 6)
  { id: '15', userId: '13', startDate: '2026-04-07', endDate: '2026-04-09', reason: '여행',     status: 'approved', createdAt: '2026-04-01' },
  { id: '16', userId: '13', startDate: '2026-05-11', endDate: '2026-05-13', reason: '개인 사정', status: 'approved', createdAt: '2026-05-05' },

  // 최지원 (userId: '14', 테이블게임팀, usedLeaves: 1)
  { id: '17', userId: '14', startDate: '2026-05-08', endDate: '2026-05-08', reason: '병원 방문', status: 'approved', createdAt: '2026-05-05' },

  // 정민하 (userId: '15', 테이블게임팀, usedLeaves: 8)
  { id: '18', userId: '15', startDate: '2026-03-17', endDate: '2026-03-19', reason: '여행',     status: 'approved', createdAt: '2026-03-10' },
  { id: '19', userId: '15', startDate: '2026-04-21', endDate: '2026-04-22', reason: '가족 행사', status: 'approved', createdAt: '2026-04-15' },
  { id: '20', userId: '15', startDate: '2026-05-04', endDate: '2026-05-06', reason: '개인 사정', status: 'approved', createdAt: '2026-04-28' },

  // 한수진 (userId: '16', 테이블게임팀, usedLeaves: 3)
  { id: '21', userId: '16', startDate: '2026-04-28', endDate: '2026-04-30', reason: '개인 사정', status: 'approved', createdAt: '2026-04-22' },

  // 오준혁 (userId: '17', 테이블게임팀, usedLeaves: 0)
  { id: '22', userId: '17', startDate: '2026-05-26', endDate: '2026-05-27', reason: '개인 사정', status: 'pending',  createdAt: '2026-05-19' },

  // 신예린 (userId: '18', 테이블게임팀, usedLeaves: 5)
  { id: '23', userId: '18', startDate: '2026-04-14', endDate: '2026-04-15', reason: '가족 행사', status: 'approved', createdAt: '2026-04-08' },
  { id: '24', userId: '18', startDate: '2026-05-19', endDate: '2026-05-21', reason: '여행',     status: 'approved', createdAt: '2026-05-12' },

  // 류성민 (userId: '19', 테이블게임팀, usedLeaves: 7)
  { id: '25', userId: '19', startDate: '2026-03-24', endDate: '2026-03-25', reason: '여행',     status: 'approved', createdAt: '2026-03-18' },
  { id: '26', userId: '19', startDate: '2026-04-28', endDate: '2026-04-29', reason: '개인 사정', status: 'approved', createdAt: '2026-04-22' },
  { id: '27', userId: '19', startDate: '2026-05-12', endDate: '2026-05-14', reason: '병원 방문', status: 'approved', createdAt: '2026-05-07' },

  // 윤재원 (userId: '20', 테이블게임팀, usedLeaves: 2)
  { id: '28', userId: '20', startDate: '2026-05-11', endDate: '2026-05-12', reason: '개인 사정', status: 'approved', createdAt: '2026-05-06' },

  // 임채원 (userId: '21', 전자게임팀, usedLeaves: 9)
  { id: '29', userId: '21', startDate: '2026-03-09', endDate: '2026-03-11', reason: '여행',     status: 'approved', createdAt: '2026-03-03' },
  { id: '30', userId: '21', startDate: '2026-04-06', endDate: '2026-04-08', reason: '가족 행사', status: 'approved', createdAt: '2026-03-31' },
  { id: '31', userId: '21', startDate: '2026-05-04', endDate: '2026-05-06', reason: '개인 사정', status: 'approved', createdAt: '2026-04-28' },

  // 홍지민 (userId: '22', 전자게임팀, usedLeaves: 4)
  { id: '32', userId: '22', startDate: '2026-04-21', endDate: '2026-04-22', reason: '병원 방문', status: 'approved', createdAt: '2026-04-16' },
  { id: '33', userId: '22', startDate: '2026-05-19', endDate: '2026-05-20', reason: '개인 사정', status: 'approved', createdAt: '2026-05-13' },

  // 남궁민 (userId: '23', 전자게임팀, usedLeaves: 6)
  { id: '34', userId: '23', startDate: '2026-04-13', endDate: '2026-04-15', reason: '여행',     status: 'approved', createdAt: '2026-04-07' },
  { id: '35', userId: '23', startDate: '2026-05-11', endDate: '2026-05-13', reason: '가족 행사', status: 'approved', createdAt: '2026-05-06' },

  // 배수현 (userId: '24', 전자게임팀, usedLeaves: 0)
  { id: '36', userId: '24', startDate: '2026-05-26', endDate: '2026-05-27', reason: '개인 사정', status: 'pending',  createdAt: '2026-05-20' },

  // 서동현 (userId: '25', 전자게임팀, usedLeaves: 3)
  { id: '37', userId: '25', startDate: '2026-05-06', endDate: '2026-05-08', reason: '병원 방문', status: 'approved', createdAt: '2026-04-30' },

  // 권나은 (userId: '26', 전자게임팀, usedLeaves: 5)
  { id: '38', userId: '26', startDate: '2026-04-07', endDate: '2026-04-08', reason: '개인 사정', status: 'approved', createdAt: '2026-04-02' },
  { id: '39', userId: '26', startDate: '2026-05-13', endDate: '2026-05-15', reason: '여행',     status: 'approved', createdAt: '2026-05-07' },

  // 문준서 (userId: '27', 전자게임팀, usedLeaves: 1)
  { id: '40', userId: '27', startDate: '2026-05-08', endDate: '2026-05-08', reason: '병원 방문', status: 'approved', createdAt: '2026-05-05' },

  // 노은지 (userId: '28', 전자게임팀, usedLeaves: 7)
  { id: '41', userId: '28', startDate: '2026-03-16', endDate: '2026-03-17', reason: '가족 행사', status: 'approved', createdAt: '2026-03-11' },
  { id: '42', userId: '28', startDate: '2026-04-20', endDate: '2026-04-22', reason: '여행',     status: 'approved', createdAt: '2026-04-14' },
  { id: '43', userId: '28', startDate: '2026-05-06', endDate: '2026-05-07', reason: '개인 사정', status: 'approved', createdAt: '2026-04-30' },

  // 심재훈 (userId: '29', 전자게임팀, usedLeaves: 4)
  { id: '44', userId: '29', startDate: '2026-04-28', endDate: '2026-04-29', reason: '개인 사정', status: 'approved', createdAt: '2026-04-23' },
  { id: '45', userId: '29', startDate: '2026-05-19', endDate: '2026-05-20', reason: '가족 행사', status: 'approved', createdAt: '2026-05-13' },

  // 지수아 (userId: '30', 전자게임팀, usedLeaves: 0) - 신청 없음

  // 고미래 (userId: '31', 오퍼레이션지원팀, usedLeaves: 10)
  { id: '46', userId: '31', startDate: '2026-02-23', endDate: '2026-02-25', reason: '여행',     status: 'approved', createdAt: '2026-02-17' },
  { id: '47', userId: '31', startDate: '2026-03-23', endDate: '2026-03-25', reason: '가족 행사', status: 'approved', createdAt: '2026-03-17' },
  { id: '48', userId: '31', startDate: '2026-04-20', endDate: '2026-04-21', reason: '개인 사정', status: 'approved', createdAt: '2026-04-14' },
  { id: '49', userId: '31', startDate: '2026-05-11', endDate: '2026-05-12', reason: '병원 방문', status: 'approved', createdAt: '2026-05-06' },

  // 안서현 (userId: '32', 오퍼레이션지원팀, usedLeaves: 5)
  { id: '50', userId: '32', startDate: '2026-04-07', endDate: '2026-04-09', reason: '여행',     status: 'approved', createdAt: '2026-04-01' },
  { id: '51', userId: '32', startDate: '2026-05-19', endDate: '2026-05-20', reason: '개인 사정', status: 'approved', createdAt: '2026-05-13' },

  // 황진우 (userId: '33', 오퍼레이션지원팀, usedLeaves: 3)
  { id: '52', userId: '33', startDate: '2026-05-06', endDate: '2026-05-08', reason: '개인 사정', status: 'approved', createdAt: '2026-04-30' },

  // 유하린 (userId: '34', 오퍼레이션지원팀, usedLeaves: 0)
  { id: '53', userId: '34', startDate: '2026-05-26', endDate: '2026-05-28', reason: '여행',     status: 'pending',  createdAt: '2026-05-19' },

  // 전도현 (userId: '35', 오퍼레이션지원팀, usedLeaves: 6)
  { id: '54', userId: '35', startDate: '2026-04-13', endDate: '2026-04-15', reason: '가족 행사', status: 'approved', createdAt: '2026-04-07' },
  { id: '55', userId: '35', startDate: '2026-05-11', endDate: '2026-05-13', reason: '개인 사정', status: 'approved', createdAt: '2026-05-06' },

  // 조은혜 (userId: '36', 오퍼레이션지원팀, usedLeaves: 4)
  { id: '56', userId: '36', startDate: '2026-04-20', endDate: '2026-04-21', reason: '개인 사정', status: 'approved', createdAt: '2026-04-15' },
  { id: '57', userId: '36', startDate: '2026-05-19', endDate: '2026-05-20', reason: '가족 행사', status: 'approved', createdAt: '2026-05-13' },

  // 도지호 (userId: '37', 오퍼레이션지원팀, usedLeaves: 1)
  { id: '58', userId: '37', startDate: '2026-05-14', endDate: '2026-05-14', reason: '병원 방문', status: 'approved', createdAt: '2026-05-09' },

  // 위성진 (userId: '38', 오퍼레이션지원팀, usedLeaves: 8)
  { id: '59', userId: '38', startDate: '2026-03-10', endDate: '2026-03-11', reason: '여행',     status: 'approved', createdAt: '2026-03-04' },
  { id: '60', userId: '38', startDate: '2026-04-06', endDate: '2026-04-08', reason: '개인 사정', status: 'approved', createdAt: '2026-03-31' },
  { id: '61', userId: '38', startDate: '2026-05-11', endDate: '2026-05-13', reason: '가족 행사', status: 'approved', createdAt: '2026-05-06' },

  // 변수아 (userId: '39', 오퍼레이션지원팀, usedLeaves: 2)
  { id: '62', userId: '39', startDate: '2026-05-12', endDate: '2026-05-13', reason: '병원 방문', status: 'approved', createdAt: '2026-05-07' },

  // 석민재 (userId: '40', 오퍼레이션지원팀, usedLeaves: 0)
  { id: '63', userId: '40', startDate: '2026-05-26', endDate: '2026-05-27', reason: '개인 사정', status: 'pending',  createdAt: '2026-05-19' },

  // 탁현준 (userId: '41', 카지노CS팀, usedLeaves: 7)
  { id: '64', userId: '41', startDate: '2026-03-16', endDate: '2026-03-18', reason: '여행',     status: 'approved', createdAt: '2026-03-10' },
  { id: '65', userId: '41', startDate: '2026-04-20', endDate: '2026-04-21', reason: '가족 행사', status: 'approved', createdAt: '2026-04-14' },
  { id: '66', userId: '41', startDate: '2026-05-11', endDate: '2026-05-12', reason: '개인 사정', status: 'approved', createdAt: '2026-05-06' },

  // 표지혜 (userId: '42', 카지노CS팀, usedLeaves: 3)
  { id: '67', userId: '42', startDate: '2026-05-06', endDate: '2026-05-08', reason: '병원 방문', status: 'approved', createdAt: '2026-04-30' },

  // 연지유 (userId: '43', 카지노CS팀, usedLeaves: 5)
  { id: '68', userId: '43', startDate: '2026-04-07', endDate: '2026-04-08', reason: '개인 사정', status: 'approved', createdAt: '2026-04-01' },
  { id: '69', userId: '43', startDate: '2026-05-19', endDate: '2026-05-21', reason: '여행',     status: 'approved', createdAt: '2026-05-13' },

  // 봉수현 (userId: '44', 카지노CS팀, usedLeaves: 0)
  { id: '70', userId: '44', startDate: '2026-05-27', endDate: '2026-05-28', reason: '개인 사정', status: 'pending',  createdAt: '2026-05-20' },

  // 맹도희 (userId: '45', 카지노CS팀, usedLeaves: 4)
  { id: '71', userId: '45', startDate: '2026-04-20', endDate: '2026-04-21', reason: '가족 행사', status: 'approved', createdAt: '2026-04-14' },
  { id: '72', userId: '45', startDate: '2026-05-12', endDate: '2026-05-13', reason: '개인 사정', status: 'approved', createdAt: '2026-05-07' },

  // 편준영 (userId: '46', 카지노CS팀, usedLeaves: 6)
  { id: '73', userId: '46', startDate: '2026-04-13', endDate: '2026-04-15', reason: '여행',     status: 'approved', createdAt: '2026-04-07' },
  { id: '74', userId: '46', startDate: '2026-05-11', endDate: '2026-05-13', reason: '가족 행사', status: 'approved', createdAt: '2026-05-06' },

  // 하민규 (userId: '47', 카지노CS팀, usedLeaves: 1)
  { id: '75', userId: '47', startDate: '2026-05-08', endDate: '2026-05-08', reason: '병원 방문', status: 'approved', createdAt: '2026-05-05' },

  // 국수진 (userId: '48', 카지노CS팀, usedLeaves: 9)
  { id: '76', userId: '48', startDate: '2026-02-23', endDate: '2026-02-25', reason: '여행',     status: 'approved', createdAt: '2026-02-17' },
  { id: '77', userId: '48', startDate: '2026-03-23', endDate: '2026-03-25', reason: '가족 행사', status: 'approved', createdAt: '2026-03-17' },
  { id: '78', userId: '48', startDate: '2026-04-27', endDate: '2026-04-29', reason: '개인 사정', status: 'approved', createdAt: '2026-04-21' },

  // 어재민 (userId: '49', 카지노CS팀, usedLeaves: 2)
  { id: '79', userId: '49', startDate: '2026-05-12', endDate: '2026-05-13', reason: '개인 사정', status: 'approved', createdAt: '2026-05-07' },

  // 소윤지 (userId: '50', 카지노CS팀, usedLeaves: 0) - 신청 없음
];

module.exports = { mockLeaveRequests };
