module.exports = function($scope, $element, $location, requestQueue) {
  var menu = $scope.menu = [
    {
      icon: 'home',
      path: 'home',
      tooltip: 'Home'
    },
    {
      icon: 'edit',
      path: 'sign',
      tooltip: 'Sign a document'
    },
    {
      icon: 'lock',
      path: 'encrypt',
      tooltip: 'Encrypt/decrypt'
    },
    {
      icon: 'trash',
      path: 'forget',
      tooltip: 'Forget cached keys'
    }
  ];

  requestQueue.listen(updateCounts.bind(null, true));

  $scope.check = function($event) {
    if (this.item.path === 'home') {
      requestQueue.cancelCurrentRequest();
      $location.path('/home');
      return;
    }

    if (!this.item.count) $event.preventDefault();
  }

  function updateCounts(apply) {
    menu.forEach(function(item) {
      item.count = requestQueue.counts[item.path];
    })

    if (apply) $scope.$apply();
  }

  updateCounts();
  $scope.$watch(function() {
    $element.find('[data-toggle="tooltip"]').tooltip();
  })
}