window.onload = function () {

    rutoken.ready.then(function () {
        return rutokenBrowserCheck.ifCompatible();
    }).then(function (result) {
        return result.noCheckExtension || rutoken.isExtensionInstalled();
    }).then(function (result) {
        return result ? rutoken.isPluginInstalled() : rutokenBrowserCheck.noExtension();
    }).then(function (result) {
        return result ? rutoken.loadPlugin() : rutokenBrowserCheck.noPlugin();
    }).then(function (plugin) {
        //Можно начинать работать с плагином
        initApplication(plugin);
    }).then(undefined, function (reason) {
        console.log(reason);
    });

};

function initApplication(plugin) {

    // получаем устройства с их типом
    function getDevices() {
        var devices = [];
        return plugin.enumerateDevices().then(function (deviceIds) {
            // получили список id подключенных устройств
            return Promise.all(deviceIds.map(function (id, index) {
                devices[index] = { id: id };
                return plugin.getDeviceInfo(id, plugin.TOKEN_INFO_ALGORITHMS);
            }));
        }).then(function (arrayOfAlgs) {
            // элементы массива - списки алгоритмов
            arrayOfAlgs.forEach(function (algs, index) {
                devices[index].generation =
                    algs.indexOf(plugin.PUBLIC_KEY_ALGORITHM_GOST3410_2012_256) !== -1 ||
                        algs.indexOf(plugin.PUBLIC_KEY_ALGORITHM_GOST3410_2012_512) !== -1 ? 2 : 1;
            });
            return devices;
        });
    }


    // используем функцию 
    getDevices().then(function (devices) {
        // выводим в консль список устройств в виде [{ id: 0, generation: 2}, ...]
        console.log(devices);
    }).then(undefined, function (error) {
        console.log(error);
    });

}

