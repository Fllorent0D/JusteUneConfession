angular.module('starter.controllers', [])


  .controller('settingsCtrl', function($scope, $stateParams, $http, $state, $ionicModal, $rootScope) {

    $scope.openModal = function() {
      $ionicModal.fromTemplateUrl('templates/settings.html', {
        scope: $scope,
        animation: 'fade-in-scale'
      }).then(function(modal) {
        $http.get("https://justeuneconfession.com/api/facultes").success(function(response){
          $scope.facultes = response;
          var name = window.localStorage["name"];
          angular.forEach($scope.facultes, function(value, key){
            console.log(value);
            if(value.name == name)
            {
              $scope.selectedFaculte = $scope.facultes[key];
            }
          });
        }).error(function(err, status, headers, config){
          //process error scenario.
        });

        $scope.modal = modal;
        $scope.modal.show();

      });
    };
    $scope.updateFaculte = function(test){
      window.localStorage['name'] = test.name;
      window.localStorage['completeName'] = test.completeName;
    };
    $scope.closeModal = function() {
      $scope.modal.remove();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
      $rootScope.$broadcast("updateRequired", { });

    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
      // Execute action

    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });
  })

  .controller('latestCtrl', function($scope, $state, $http, $rootScope, $ionicScrollDelegate) {
  $rootScope.$on("updateRequired", function () {
    $scope.resetList();
    $ionicScrollDelegate.scrollTop();

  });
  if(window.localStorage['intro'] == 'false')
  {
    $state.go('intro');
  }
  $scope.completeName = window.localStorage['completeName'];


  var nextPage = 1;
  $scope.confessions = [];
  $scope.loadMore = function() {
    addItems();
  };

  $scope.resetList = function(){

    $scope.confessions = [];
    nextPage = 1;
    $scope.completeName = window.localStorage['completeName'];
    $scope.viewName = $scope.completeName;

    $scope.$broadcast('scroll.refreshComplete');
    addItems();
  };

  function addItems() {

    name = window.localStorage['name'];


    var url = "https://justeuneconfession.com/"+name+"/api/confessions/" + nextPage;
    $http.get(url).success(function (response) {
      angular.forEach(response, function (value) {
        $scope.confessions.push(value);
      });

      nextPage++;
      $scope.$broadcast('scroll.infiniteScrollComplete');
    }).error(function (err, status, headers, config) {
      //process error scenario.
    });
  }
})

  .controller('randomCtrl', function($scope, $stateParams, $http, $rootScope,$ionicScrollDelegate) {

    $rootScope.$on("updateRequired", function () {
      $scope.resetList();
      $ionicScrollDelegate.scrollTop();
    });
    $scope.completeName = window.localStorage['completeName'];

    $scope.viewName = "Confessions aléatoires";

    var nextPage = 1;
    $scope.confessions = [];

    $scope.loadMore = function() {
      addItems();
    };

    $scope.resetList = function(){
      $scope.confessions = [];
      $scope.completeName = window.localStorage['completeName'];

      nextPage = 1;
      $scope.$broadcast('scroll.refreshComplete');
      addItems();
    };

    function addItems() {
      name = window.localStorage['name'];

      var url = "https://justeuneconfession.com/"+name+"/api/random/" + nextPage;
      console.log(url);
      $http.get(url).success(function (response) {
        angular.forEach(response, function (value) {
          $scope.confessions.push(value);
        });

        nextPage++;
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }).error(function (err, status, headers, config) {
        //process error scenario.
      });
    }
  })

  .controller('IntroCtrl', function($scope, $state, $http) {
    if(window.localStorage['intro'] == 'true')
    {
      $state.go('tab.latest');
    }
    $http.get("https://justeuneconfession.com/api/facultes").success(function(response){
      $scope.facultes = response;

    }).error(function(err, status, headers, config){
      //process error scenario.
    });
    $scope.updateFaculte = function(test){
      window.localStorage['name'] = test.name;
      window.localStorage['completeName'] = test.completeName;
    };


     $scope.startApp = function() {

      window.localStorage['intro'] = true;
       $state.go('tab.latest');

    };
  })

  .controller('topsCtrl', function($scope, $state, $http, $rootScope) {
    $rootScope.$on("updateRequired", function () {
      $scope.resetList();
      $ionicScrollDelegate.scrollTop();

    });

    $scope.completeName = window.localStorage['completeName'];
    $scope.viewName = "Meilleurs confessions";
    $scope.confessions = [];

    $scope.resetList = function(){
      $scope.confessions = [];
      $scope.completeName = window.localStorage['completeName'];
      name = window.localStorage['name'];

      var url = "https://justeuneconfession.com/"+name+"/api/top/";
      console.log(url);
      $http.get(url).success(function (response) {
        angular.forEach(response, function (value) {
          $scope.confessions.push(value);
        });


        $scope.$broadcast('scroll.infiniteScrollComplete');
      }).error(function (err, status, headers, config) {
        //process error scenario.
      });
      $scope.$broadcast('scroll.refreshComplete');
    };
    $scope.resetList();

  })
