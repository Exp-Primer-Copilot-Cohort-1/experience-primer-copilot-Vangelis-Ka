function skillsMember() {
  return {
    restrict: 'E',
    scope: {
      member: '=',
      skills: '='
    },
    templateUrl: 'app/components/members/member.html',
    controller: 'MemberController',
    controllerAs: 'memberCtrl'
  };
}