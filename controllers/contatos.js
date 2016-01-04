module.exports = function(app) {
	var ContatoController = {
		index: function(req, res) {
			var usuario = req.session.usuario;
			var contatos = [];
			if(usuario.contatos!=undefined){
				contatos = usuario.contatos;
			}
			var params = {usuario:usuario, contatos:contatos};
			res.render('contatos/index', params);
			},
		new: function(req,res){
			var usuario = req.session.usuario
			,contatos = usuario.contatos
			,params = {usuario:usuario, contatos:contatos};
			res.redirect('/contato', params);
		},
		create: function(req,res){
			var contato = req.body.contato
			,usuario = req.session.usuario;
			console.log(contato);
			if(usuario.contatos!=undefined){
				usuario.contatos.push(contato);
			}else{
				usuario.contatos = [];
				usuario.contatos.push(contato);
			}
			res.redirect('/contatos');
		},
		show: function(req,res){
			var id = req.params.id
			,contato = req.session.usuario.contatos[id]
			,params = {contato:contato,id:id};
			res.render('contatos/show', params);
		},
		edit: function(req,res){
			var id = req.params.id
			,usuario = req.session.usuario
			,contato = usuario.contatos[id]
			,params = {usuario:usuario, contato: contato, id:id};
			res.render('contatos/edit',	params);
		},
		update: function(req,res){
			var contato = req.body.contato
			,usuario = req.session.usuario;
			console.log(contato);
			console.log(req.params.id);
			usuario.contatos[req.params.id] = contato;
			res.redirect('/contatos');
		},
		destroy: function(req,res){
			var usuario = req.session.usuario
			,id = req.params.id;
			usuario.contatos.splice(id,1);
			res.redirect('/contatos');
		}
	};
	return ContatoController;
};