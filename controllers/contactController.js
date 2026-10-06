const mongoose = require('mongoose');
const Contact = require('../models/Contact');

/**
 * Helper to find a contact by MongoDB _id OR custom contactId
 */
const findContactByIdOrCustomId = async (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return await Contact.findOne({
      $or: [{ _id: id }, { contactId: id }],
    });
  }
  return await Contact.findOne({ contactId: id });
};

/**
 * @desc    Create a new contact
 * @route   POST /contacts
 */
exports.createContact = async (req, res, next) => {
  try {
    const { contactId, name, phone, email } = req.body;

    // Check for duplicate contactId or email upfront for clear error messages
    const existingContact = await Contact.findOne({
      $or: [{ contactId }, { email }],
    });

    if (existingContact) {
      if (existingContact.contactId === contactId) {
        return res.status(409).json({
          success: false,
          message: `Contact with contactId '${contactId}' already exists.`,
        });
      }
      if (existingContact.email === email) {
        return res.status(409).json({
          success: false,
          message: `Contact with email '${email}' already exists.`,
        });
      }
    }

    const contact = await Contact.create({
      contactId,
      name,
      phone,
      email,
    });

    return res.status(201).json({
      success: true,
      message: 'Contact created successfully',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all contacts
 * @route   GET /contacts
 */
exports.getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single contact by ID (_id or contactId)
 * @route   GET /contacts/:id
 */
exports.getContactById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await findContactByIdOrCustomId(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: `Contact not found with ID: ${id}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update contact details
 * @route   PUT /contacts/:id
 */
exports.updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, phone, email, contactId } = req.body;

    // First check if contact exists
    const contact = await findContactByIdOrCustomId(id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: `Contact not found with ID: ${id}`,
      });
    }

    // If updating email or contactId, check for uniqueness conflict with other contacts
    if (email && email !== contact.email) {
      const emailExists = await Contact.findOne({ email, _id: { $ne: contact._id } });
      if (emailExists) {
        return res.status(409).json({
          success: false,
          message: `Contact with email '${email}' already exists.`,
        });
      }
    }

    if (contactId && contactId !== contact.contactId) {
      const idExists = await Contact.findOne({ contactId, _id: { $ne: contact._id } });
      if (idExists) {
        return res.status(409).json({
          success: false,
          message: `Contact with contactId '${contactId}' already exists.`,
        });
      }
    }

    // Apply updates using findByIdAndUpdate with runValidators: true to trigger schema validation
    const updatedContact = await Contact.findByIdAndUpdate(
      contact._id,
      {
        ...(contactId && { contactId }),
        ...(name && { name }),
        ...(phone && { phone }),
        ...(email && { email }),
      },
      {
        new: true, // Return modified document
        runValidators: true, // Ensure update respects schema validators (regex, etc.)
      }
    );

    return res.status(200).json({
      success: true,
      message: 'Contact updated successfully',
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a contact
 * @route   DELETE /contacts/:id
 */
exports.deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await findContactByIdOrCustomId(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: `Contact not found with ID: ${id}`,
      });
    }

    await Contact.findByIdAndDelete(contact._id);

    return res.status(200).json({
      success: true,
      message: 'Contact deleted successfully',
      data: { id: contact._id, contactId: contact.contactId },
    });
  } catch (error) {
    next(error);
  }
};
