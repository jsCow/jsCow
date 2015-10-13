$(function(){
	
	/* Initialize and configure of jsCow framework */
	jsCow.setup({
		url: {
			base: 'js/lib/jsCow/',
			applications: 'js/lib/jsCow/applications/',
			res: 'js/lib/jsCow/res/'
		}
	});
	
	myTestApp = jsCow.applications.add('myTestAppId').get();
		
		win = jsCow.components.get(jsCow.res.components.window).setID("win").setConfig({ title: 'Window' }).setPos(20,50).setWidth(800).setHeight(500);
		
		winCnt = jsCow.components.get(jsCow.res.components.group);
		win.add(winCnt);
		
		bar = jsCow.components.get(jsCow.res.components.bar);
		bar.setPosition({
			position: 'absolute',
			bottom: 0
		});
		win.add(bar);
		
		button = jsCow.components.get(jsCow.res.components.button).setClickHandler(function() {
			win.append(
				jsCow.components.get(jsCow.res.components.window).setConfig({ title: 'Window 3' }).setPos(30,100).setWidth(300).setHeight(200).setID("StefanWindow")
			);
			
			this.disabled();
		});
		bar.add(
			jsCow.components.get(jsCow.res.components.radio).setLabel("Radio Radio ").setGroup("radiogroup")
		).add(
			jsCow.components.get(jsCow.res.components.radio).setLabel("Radio Radio ").setGroup("radiogroup")
		).add(button).add(
			jsCow.components.get(jsCow.res.components.label).setLabel("Lorem ipsum dolor sit amet")
		);
		
		button = jsCow.components.get(jsCow.res.components.button).setTitle("Button").setClickHandler(function() {
			jsCow.components.find("StefanWindow").append(
				jsCow.components.get(jsCow.res.components.panel).add(
					jsCow.components.get(jsCow.res.components.label).setLabel("Stefan is cool...")
				)
			);
		});
		bar.add(button).add(
			jsCow.components.get(jsCow.res.components.checkbox).setLabel("Lorem ipsum dolor sit amet")
		);

		button = jsCow.components.get(jsCow.res.components.button);
		bar.add(button);
		
		panel = jsCow.components.get(jsCow.res.components.panel).open();
			label = jsCow.components.get(jsCow.res.components.label);
			label.setConfig({ label: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.' });
		panel.add(label).add(
			jsCow.components.get(jsCow.res.components.radio).setLabel("Radio Radio ").setGroup("radiogroup")
		).add(
			jsCow.components.get(jsCow.res.components.radio).setLabel("Radio Radio ").setGroup("radiogroup")
		).add(
			jsCow.components.get(jsCow.res.components.radio).setLabel("Radio Radio ").setGroup("radiogroup")
		).add(
			jsCow.components.get(jsCow.res.components.radio).setLabel("Radio Radio ").setGroup("radiogroup")
		);
		winCnt.add(panel);
		
		winCnt.add(
			jsCow.components.get(jsCow.res.components.panel).setTitle('Panel 2').collapse().disabled()
		);

		panel3 = jsCow.components.get(jsCow.res.components.panel).setTitle('Panel 3').collapse().add(
			jsCow.components.get(jsCow.res.components.label).setLabel("Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.")
		);
		winCnt.add(panel3);
		
		panel4 = jsCow.components.get(jsCow.res.components.panel).setTitle('Panel 4').setMainStyle("margin-bottom: 40px;").open().add(
			jsCow.components.get(jsCow.res.components.label).setConfig({ label: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.' })
		).add(
			jsCow.components.get(jsCow.res.components.radio).setLabel("Radio Radio ").setGroup("radiogroup1")
		).add(
			jsCow.components.get(jsCow.res.components.radio).setLabel("Radio Radio ").setGroup("radiogroup1")
		).add(
			jsCow.components.get(jsCow.res.components.radio).setLabel("Radio Radio ").setGroup("radiogroup1")
		).add(
			jsCow.components.get(jsCow.res.components.radio).setLabel("Radio Radio ").setGroup("radiogroup1")
		);
		panel.events.register("onchange", panel4, function(e) {
			console.log(e);
		});
		winCnt.add(panel4);
		
	myTestApp.add(win);	
	
		win2 = jsCow.components.get(jsCow.res.components.window).setID("win2").setConfig({ title: 'Window 2' }).setPos(80,800).setWidth(400).setHeight(400);
		fieldset1 = jsCow.components.get(jsCow.res.components.fieldset).setTitle("Fieldset").add(
			jsCow.components.get(jsCow.res.components.label).setLabel("Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.")
		);
		win2.add( fieldset1 );
		
		win2.add( 
			jsCow.components.get(jsCow.res.components.bar).add(
				jsCow.components.get(jsCow.res.components.button).setTitle("Button") 
			)
		);

		fieldset2 = jsCow.components.get(jsCow.res.components.fieldset).setTitle("Fieldset").disabled().add(
			jsCow.components.get(jsCow.res.components.label).setLabel("Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.")
		);
		win2.add( fieldset2 );
		
	myTestApp.add(win2);

		win3 = jsCow.components.get(jsCow.res.components.window).setID("win3").setConfig({ title: 'Window 3' }).setPos(30,900).setWidth(400).setHeight(300);
		win3.add( 
			jsCow.components.get(jsCow.res.components.textarea)
		).add( 
			jsCow.components.get(jsCow.res.components.input)
		);

		/*
		*/
			layout3 = jsCow.components.get(jsCow.res.components.splitter).setID("layout3").setSplitHorizontal().setSplitterConfig({
				resizer: [true],
				sizes: [100, "auto"]
			}).add(
				jsCow.components.get(jsCow.res.components.group)
			).add(
				jsCow.components.get(jsCow.res.components.group)
			);
			
			layout2 = jsCow.components.get(jsCow.res.components.splitter).setID("layout2").setSplitVertical().setSplitterConfig({
				resizer: [true, true],
				sizes: [100, "100", "auto"]
			}).add(
				jsCow.components.get(jsCow.res.components.group).add(
					layout3
				)
			).add(
				jsCow.components.get(jsCow.res.components.group)
			).add(
				jsCow.components.get(jsCow.res.components.group)
			);
			
			layout1 = jsCow.components.get(jsCow.res.components.splitter).setID("layout1").setSplitHorizontal().setSplitterConfig({
				resizer: [true, true],
				sizes: [100, "100", "auto"]
			}).add(
				jsCow.components.get(jsCow.res.components.group).add(
					panel = jsCow.components.get(jsCow.res.components.panel).setTitle("Panel Title").collapse().add(
						jsCow.components.get(jsCow.res.components.label).setConfig({ label: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.' })
					)
				)
			).add(
				jsCow.components.get(jsCow.res.components.group)
			).add(
				jsCow.components.get(jsCow.res.components.group).add(
					layout2
				)
			);
			
		win3.add( layout1 );
		
		myTestApp.add(win3);

		/*
		win4 = jsCow.components.get(jsCow.res.components.window).setID("win4");
		win4.setConfig({ title: 'Window' }).setPos(120,800).setWidth(600).setHeight(400);
		win4.add(
			jsCow.components.get(jsCow.res.components.group).setMainStyle("jscow-padded").add(
				jsCow.components.get(jsCow.res.components.input).setID("input1").setValue("Input Field")
			)
		).add(
			jsCow.components.get(jsCow.res.components.group).setMainStyle("jscow-padded").add(
				jsCow.components.get(jsCow.res.components.input).disabled().setValue("Input Field").setAlign("none")
			)
		).add(
			jsCow.components.get(jsCow.res.components.group).setMainStyle("jscow-padded").add(
				jsCow.components.get(jsCow.res.components.input).setValue("Input Field").setAlign("right")
			)
		).add(
			jsCow.components.get(jsCow.res.components.group).setMainStyle("jscow-padded").add(
				jsCow.components.get(jsCow.res.components.checkbox).setLabel("Checkbox")
			).add(
				jsCow.components.get(jsCow.res.components.checkbox).setLabel("Checkbox").disabled()
			).add(
				jsCow.components.get(jsCow.res.components.checkbox).setLabel("Checkbox").checked()
			)
		).add(
			jsCow.components.get(jsCow.res.components.group).setMainStyle("jscow-padded").add(
				jsCow.components.get(jsCow.res.components.textarea).setValue("Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.")
			)
		).add(
			jsCow.components.get(jsCow.res.components.group).setMainStyle("jscow-padded").add(
				jsCow.components.get(jsCow.res.components.textarea).disabled().setAlign("none").setValue("Lorem ipsum dolor sit amet, consetetur sadipscing elitr")
			)
		).add(
			jsCow.components.get(jsCow.res.components.group).setMainStyle("jscow-padded").add(
				jsCow.components.get(jsCow.res.components.textarea).setAlign("right").setValue("Lorem ipsum dolor sit amet, consetetur sadipscing elitr")
			)
		).add(
			jsCow.components.get(jsCow.res.components.group).setMainStyle("jscow-padded").add(
				jsCow.components.get(jsCow.res.components.radio).setLabel("Radio").setGroup("radiogroup").checked()
			).add(
				jsCow.components.get(jsCow.res.components.radio).setLabel("Radio").setGroup("radiogroup").disabled()
			).add(
				jsCow.components.get(jsCow.res.components.radio).setLabel("Radio").setGroup("radiogroup")
			)
		);
		
	myTestApp.add(win4);
	*/

	/*
	myTestApp.add(
		jsCow.components.get(jsCow.res.components.splitter).setSplitHorizontal().setSplitterConfig({
			resizer: [true],
			sizes: ["20%", "auto"]
		}).add(
			jsCow.components.get(jsCow.res.components.group).add(
				jsCow.components.get(jsCow.res.components.splitter).setSplitVertical().setSplitterConfig({
					resizer: [true],
					sizes: ["30%", "auto"]
				}).add(
					jsCow.components.get(jsCow.res.components.group).add(
						jsCow.components.get(jsCow.res.components.splitter).setSplitHorizontal().setSplitterConfig({
							resizer: [true],
							sizes: ["50%", "auto"]
						}).add(
							jsCow.components.get(jsCow.res.components.group)
						).add(
							jsCow.components.get(jsCow.res.components.group)
						)
					)
				).add(
					jsCow.components.get(jsCow.res.components.group)
				)
			)
		).add(
			jsCow.components.get(jsCow.res.components.group).add(
				jsCow.components.get(jsCow.res.components.splitter).setSplitVertical().setSplitterConfig({
					resizer: [true],
					sizes: ["70%", "auto"]
				}).add(
					jsCow.components.get(jsCow.res.components.group)
				).add(
					jsCow.components.get(jsCow.res.components.group)
				)
			)
		)
	);
	*/
	
	
	/*
	win4.events.register("onBeforeClose", win2, function(e) {
		console.log(this);
	});
	win4.events.register("onBeforeClose", win2, function(e) {
		
	});
	win4.events.register("onBeforeClose", win2, function(e) {
		
	});
	
	win4.events.register("onClose", win2, function(e) {
		e.sender.del();
	});
	*/
	

	/*
	stefan = jsCow.components.get(jsCow.res.components.window);
	stefan.setConfig({
		title: "Stefan's Fenster"
	}).setHeight(200).setWidth(400);

	stefan.events.register("onClose", stefan, function(e) {
		alert("muh...");
	});
	myTestApp.add(stefan);
	*/
	
	myTestApp.run();
	
});
