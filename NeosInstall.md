Install Neos and build content elements
================

### Neos recommend environment settings ###

	```
	PHP > 5.5 (7.0)
	ImageMagick and PHP Module
	PHP Settings: date.timezone = "Europe/Berlin"
	PHP Settings: upload_max_filesize = {as much as possible}
	PHP Settings: memory_limit = 512M
	ElasticSearch (https://www.elastic.co/downloads)
	MySQL / MariaDB
	Apache 2.4
	```

### Install Neos with composer ###

##### To use composer u have to install it #####

	$ curl -s https://getcomposer.org/installer | php
	$ mv composer.phar /usr/local/bin/composer

##### Install Neos #####

	$ cd {project_dir}
	$ composer create-project typo3/neos-base-distribution .

##### vHost and hosts #####

```sh
<VirtualHost 127.0.0.1:80>
	ServerName dgppn.dev

	Setenv FLOW_CONTEXT Development

	DocumentRoot       /path/to/your/project/Web/
	DirectoryIndex     index.html index.php

	<Directory /path/to/your/project/Web/>
		Options FollowSymlinks
		AllowOverride All
		Allow from all
		DirectoryIndex index.html index.htm index.php
	</Directory>

	ErrorLog  /path/to/your/logs/error_dgppn_log
	CustomLog /path/to/your/logs/access_dgppn_log combined
</VirtualHost>
```

```sh
$ 127.0.0.1       dgppn.dev
```

### Setup ###

Follow the setup instructions and install Neos

- Configure database
- Create administrator account
- Import the site from demo package or build a new site
- Go to the backend and/or the frontend

- - -

### Build a custom site ###

It is eassy to build a new site if u have a look at the demo package ([TYPO3.NeosDemoTypo3Org](https://github.com/neos/neosdemotypo3org)).
All simple and frequently used content elements are included in this package.

If you need a deep look into the possabilities of Neos content elements you should have a look at the packages [TYPO3.Neos](https://github.com/neos/neos) and [TYPO3.Neos.NodeTypes](https://github.com/neos/neos-nodetypes).

##### Flow/Neos Package Structure #####
###### (Site and Application) ######

	Vendor.PackageName/
		Classes/
			Vendor/
				PackageName/
					Controller/
					Domain/
						Model/
						Repository/
					Services/
					Utilities/
					EelHelper/
					ViewHelper/
		Configuration/
			Settings.yaml
			Routes.yaml
			Caches.yaml
			Objects.yaml
			NodeTypes.yaml
		Documentation/
		Migrations/
			MySQL/
		Resources/
			Private/
				Content/
				Images/
				JavaScript/
				Sass/
				Templates/
					Page/
					NodeTypes/
					TypoScriptObjects/
				Translations/
					de/
					en/
				TypoScript/
					NodeTypes/
			Public/
				JavaScript/
				Styles/
					Images/
		Tests/


##### How to build an element #####

In your site package you define a new NodeType in your NodeTypes.yaml

```yaml
'Vendor.PackageName:ElementName':
	superTypes: # heredity of abstract NodeTypes/Mixins
		'TYPO3.Neos:Content': TRUE # all elements inherit from this NodeType

	ui:
		label: i18n # Translation for the multilanguage backend
		icon: 'icon-user' # FontAwesome 3.2.1 Icons
		group: 'general' # the group which will display your element
		inlineEditable: TRUE # if the NodeType is inline editable
		position: 100 # possible also "before/after element/number", "start/end"
		inspector:
			groups:
				customgroupname:
					label: i18n
					position: 10

	childNodes: # auto created child nodes
		nodename: # custom node path name
			type: 'TYPO3.Neos:ContentCollection' # NodeType of the child
			constraints: &constrainMarker # constraint which elements are allowed inside the child
				nodeTypes: # the YAML marker '&somename' gives you the possibility to copy all inside this structure to another place inside the file
					'*': FALSE # disable all NodeTypes
					'Vendor.PackageName:Element': TRUE # enable specific NodeTypes
					'Vendor.PackageName:OtherElement': TRUE
		anothernodename:
			type: 'TYPO3.Neos:ContentCollection'
			constraints: *constrainMarker # copy 'constrainMarker' at this position with the '*'

	properties: # define the properties of the NodeType
		customname:
			type: string # multiple types available (string, boolean, integer, array, Domain objects)
						 # for more information take a look into TYPO3.Neos/Configuration/Settings.yaml at Line 185 (Inspector: dataTypes)
			defaultValue: ''
			ui:
				label: i18n
				inlineEditable: TRUE # if the property is inline editable (in this case you dont need reloadIfChanged)
				reloadIfChanged: TRUE # reloads the content section if a change in the inspector is made
				inspector:
					group: 'customgroupname' # define in which group this property will be displayed in inspector
					position: 400
					editor: 'TYPO3.Neos/Inspector/Editors/SelectBoxEditor' # one of the inspector editors
																		   # for more see: TYPO3.Neos/Resources/Public/JavaScript/Content/Inspector/Editors
						editorOptions:
							placeholder: i18n
							values:
								'':
									label: ''
								center:
									label: i18n
								left:
									label: i18n
```

After that you can choose your NodeType in the Backend.
Now you need a Template for your NodeType.
You can create it in your site package in **Resources/Private/Templates/NodeTypes/**

```html
<!-- for templating, your imagination knows no bounds -->
<div class="yourClass">
	{property} <!-- a plain property that is only displayed -->
	{neos:contentElement.editable(property: 'anotherproperty', tag: 'div', class: 'CssClassName')} <!-- an inline editable property -->
</div>
```
The documentation and Viewhelper reference for Fluid is [here](http://flowframework.readthedocs.org/en/stable/TheDefinitiveGuide/PartV/FluidViewHelperReference.html)

If some property should be parsed or rendered another way as plain output you can use TypoScript 2 for that.
Define a new prototype in your **Resources/Private/TypoScript/Roots.ts2**

```typoscript
# ====================================================
# Vendor.PackageName:ElementName
# ====================================================
prototype(Vendor.PackageName:ElementName) {
	newproperty = ${'sometext ' + q(node).property('customname')}
}
```

All possibilities for TypoScript 2 can be found in the [Pocket Reference](http://learn-neos.com/reference/pocket-reference-typoscript2.html)

- - -

If there are questions please drop me an email to <webdesign2be@gmail.com>

Enjoy Neos!
